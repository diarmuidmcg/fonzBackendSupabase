import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { Profiles } from './profiles.entity';

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

import { Organizations } from 'src/organizations/organizations.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profiles)
    private profilesRepository: Repository<Profiles>,
    @InjectRepository(Organizations)
    private organizationsRepository: Repository<Organizations>,
  ) {}

  async getProfiles(request, response): Promise<Profiles[]> {
    globalThis.Logger.log({ level: 'info', message: 'Get profiles ' });
    const profiles = await this.profilesRepository
      .createQueryBuilder('profiles')
      .getMany();
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Profiles Response ' + JSON.stringify(profiles),
    });
    return response.status(200).json(profiles);
  }

  async getSingleProfile(request, response): Promise<Profiles[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Get profile ' + id });
    const profile = await this.profilesRepository
      .createQueryBuilder('profiles')
      .where('profiles.id = :id', { id })
      .getOne();
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Profile Response ' + JSON.stringify(profile),
    });
    return response.status(200).json(profile);
  }

  public async createProfile(request, response): Promise<Profiles[]> {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      occupation,
      linkedin_username,
      instagram_username,
      orgId,
      auth_identifier,
      bio,
    } = request.body;

    // type check all NOT Nullable
    let mustInclude = [];
    if (!first_name) mustInclude.push('first_name');
    if (!last_name) mustInclude.push('last_name');
    if (!email) mustInclude.push('email');
    if (!auth_identifier) mustInclude.push('auth_identifier');

    // type check email
    if (!validateEmail(email)) mustInclude.push('email must be proper format');
    if (mustInclude.length > 0)
      return response.status(400).json({
        error:
          'You must include these BODY parameters: ' +
          JSON.stringify(mustInclude),
      });

    const newProfile = new Profiles();
    newProfile.first_name = first_name !== null ? first_name : '';
    newProfile.last_name = last_name !== null ? last_name : '';
    newProfile.email = email !== null ? email : '';
    newProfile.phone_number = phone_number !== null ? phone_number : '';
    newProfile.occupation = occupation !== null ? occupation : '';
    newProfile.linkedin_username =
      linkedin_username !== null ? linkedin_username : '';
    newProfile.instagram_username =
      instagram_username !== null ? instagram_username : '';
    newProfile.auth_identifier = auth_identifier;
    newProfile.bio = bio !== null ? bio : '';

    // set org
    if (orgId != undefined) {
      const organization = await this.organizationsRepository
        .createQueryBuilder('organizations')
        .where('organizations.id = :orgId', { orgId })
        .getOne();

      // make sure org exists
      if (organization == undefined || organization == null)
        return response.status(400).json({
          error: `this organization (id ${orgId}) does not exist`,
        });

      newProfile.organization = organization;
    }

    globalThis.Logger.log({ level: 'info', message: 'New Profile' });
    globalThis.Logger.log({
      level: 'info',
      message: JSON.stringify(newProfile),
    });

    try {
      const data = await this.profilesRepository.save(newProfile);
      globalThis.Logger.log({
        level: 'info',
        message: 'New Profile Response error ' + JSON.stringify(data),
      });
      return response.status(200).json(data);
    } catch (e) {
      globalThis.Logger.log({
        level: 'info',
        message: 'New Profile Response Error' + JSON.stringify(e),
      });
      return response.status(400).json({ error: e });
    }
  }

  public async updateProfile(request, response): Promise<Profiles[]> {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      occupation,
      linkedin_username,
      instagram_username,
      orgId,
      bio,
    } = request.body;
    const { id } = request.params;

    const currentProfile = await this.profilesRepository
      .createQueryBuilder('profiles')
      .leftJoinAndSelect('profiles.organization', 'organization')
      .where('profiles.id = :id', { id })
      .getOne();

    // make sure upcycler exists
    if (currentProfile == undefined)
      return response
        .status(400)
        .json({ error: 'this profileId does not exist' });

    const updatedProfile = new Profiles();

    // type check all NOT Nullable
    let mustInclude = [];
    if (email != undefined) {
      // type check email
      if (!validateEmail(email))
        mustInclude.push('email must be proper format');
      updatedProfile.email = email;
    }
    // for returning improper email format
    if (mustInclude.length > 0)
      return response.status(400).json({
        error:
          'You must include these BODY parameters: ' +
          JSON.stringify(mustInclude),
      });

    if (first_name != undefined) updatedProfile.first_name = first_name;
    if (last_name != undefined) updatedProfile.last_name = last_name;
    if (phone_number != undefined) updatedProfile.phone_number = phone_number;
    if (occupation != undefined) updatedProfile.occupation = occupation;
    if (linkedin_username != undefined)
      updatedProfile.linkedin_username = linkedin_username;
    if (instagram_username != undefined)
      updatedProfile.instagram_username = instagram_username;
    if (bio != undefined) updatedProfile.bio = bio;

    // set org
    if (orgId != undefined) {
      const organization = await this.organizationsRepository
        .createQueryBuilder('organizations')
        .where('organizations.id = :orgId', { orgId })
        .getOne();

      // make sure org exists
      if (organization == undefined || organization == null)
        return response.status(400).json({
          error: `this organization (id ${orgId}) does not exist`,
        });

      updatedProfile.organization = organization;
    }

    globalThis.Logger.log({ level: 'info', message: 'Update Profile' });
    globalThis.Logger.log({
      level: 'info',
      message: JSON.stringify(updatedProfile),
    });

    // merge new info into existing hire
    // ** we need to merge instead of usual keyword 'update'
    // because of images (oneToMany external relationship)
    // this case is not supported by the keyword 'update'
    this.profilesRepository.merge(currentProfile, updatedProfile);
    // save it
    const data = await this.profilesRepository.save(currentProfile);

    globalThis.Logger.log({
      level: 'info',
      message: 'Updated Profile Response ' + JSON.stringify(currentProfile),
    });
    return response.status(200).json(currentProfile);
  }

  async deleteProfile(request, response): Promise<Profiles[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Remove profile ' + id });
    const profile = await this.profilesRepository.delete({ id });
    globalThis.Logger.log({
      level: 'info',
      message: 'Remove Profile Response ' + JSON.stringify(profile),
    });
    return response.status(200).json(profile);
  }
}
