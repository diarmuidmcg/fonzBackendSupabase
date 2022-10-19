import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { time } from 'console';
import { title } from 'process';
// import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { Events } from './events.entity';

import { ImagesService } from 'src/images/images.service';
import { Profiles } from 'src/profiles/profiles.entity';
import { Organizations } from 'src/organizations/organizations.entity';

const validateDate = (date) => {
  // return date.match(
  //   /^\d{4}\/\d{1,2}\/\d{1,2}$/,
  // );
  if (
    !date.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
  )
    return false;
  var parts = date.split('/');
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;
  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;
  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
  return true;
};
const validateTime = (time) => {
  if (!time.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) return false;
  return true;
};
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events) private eventsRepository: Repository<Events>,
    @InjectRepository(Profiles)
    private profilesRepository: Repository<Profiles>,
    @InjectRepository(Organizations)
    private organizationsRepository: Repository<Organizations>,
    private readonly imageService: ImagesService,
  ) {}

  async getEvents(request, response): Promise<Events[]> {
    // if query param 'hostId' or 'orgId' is passed in, just get related ones
    const { offset, limit, hostId, orgId } = request.query;
    globalThis.Logger.log({ level: 'info', message: 'Get events ' });

    let events;

    if (offset != undefined && limit != undefined) {
      if (hostId != undefined) {
        events = await this.eventsRepository
          .createQueryBuilder('events')
          .leftJoin('events.image', 'image')
          .leftJoin('events.host', 'host')
          .leftJoin('events.attendees', 'attendees')
          .select([
            'events',
            'image',
            'host.id',
            'host.first_name',
            'host.linkedin_username',
            'host.occupation',
            'attendees.id',
            'attendees.first_name',
            'attendees.linkedin_username',
            'attendees.occupation',
          ])
          .take(limit)
          .skip(offset)
          .where('events.host.id = :id', { id: hostId })
          .getMany();
      }
      // else if (orgId != undefined) {
      //   events = await this.eventsRepository
      //     .createQueryBuilder('events')
      //     .leftJoinAndSelect('events.image', 'image')
      //     .leftJoin('events.host', 'host')
      //     .leftJoin('events.attendees', 'attendees')
      //     .select([
      //       'events',
      //       'host.id',
      //       'host.first_name',
      //       'host.linkedin_username',
      //       'host.occupation',
      //       'attendees.id',
      //       'attendees.first_name',
      //       'attendees.linkedin_username',
      //       'attendees.occupation',
      //     ])
      //     .take(limit)
      //     .skip(offset)
      //     .where('events.organization.id = :id', { id: orgId })
      //     .getMany();
      // }
      else {
        events = await this.eventsRepository
          .createQueryBuilder('events')
          .leftJoin('events.image', 'image')
          .leftJoin('events.host', 'host')
          .leftJoin('events.attendees', 'attendees')
          .select([
            'events',
            'image',
            'host.id',
            'host.first_name',
            'host.linkedin_username',
            'host.occupation',
            'attendees.id',
            'attendees.first_name',
            'attendees.linkedin_username',
            'attendees.occupation',
          ])
          .take(limit)
          .skip(offset)
          .getMany();
      }
    } else {
      events = await this.eventsRepository
        .createQueryBuilder('events')
        .leftJoin('events.image', 'image')
        .leftJoin('events.host', 'host')
        .leftJoin('events.attendees', 'attendees')
        .select([
          'events',
          'image',
          'host.id',
          'host.first_name',
          'host.linkedin_username',
          'host.occupation',
          'attendees.id',
          'attendees.first_name',
          'attendees.linkedin_username',
          'attendees.occupation',
        ])
        .getMany();
    }
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Events Response ' + JSON.stringify(events),
    });
    return response.status(200).json(events);
  }

  async getSingleEvent(request, response): Promise<Events[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Get event ' + id });
    const event = await this.eventsRepository
      .createQueryBuilder('events')
      .leftJoin('events.image', 'image')
      .leftJoin('events.host', 'host')
      .leftJoin('events.attendees', 'attendees')
      .select([
        'events',
        'image',
        'host.id',
        'host.first_name',
        'host.linkedin_username',
        'host.occupation',
        'attendees.id',
        'attendees.first_name',
        'attendees.linkedin_username',
        'attendees.occupation',
      ])
      .where('events.id = :id', { id })
      .getOne();
    globalThis.Logger.log({
      level: 'info',
      message: 'Get Event Response ' + JSON.stringify(event),
    });
    return response.status(200).json(event);
  }

  public async createEvent(files, request, response): Promise<Events[]> {
    const {
      title,
      location,
      date,
      time,
      price,
      description,
      hostId,
      orgId,
    } = request.body;

    // type check all NOT Nullable
    let mustInclude = [];
    if (!title) mustInclude.push('title');
    if (!location) mustInclude.push('location');
    if (!date) mustInclude.push('date');
    if (!hostId) mustInclude.push('hostId');
    // only run the validate functions if date exists
    else {
      // type check date and time
      if (!validateDate(date))
        mustInclude.push('date must be proper format: DD/MM/YYYY');
    }
    if (!time) mustInclude.push('time');
    // only run the validate functions if date exists
    else {
      // type check date and time
      if (!validateTime(time))
        mustInclude.push('time must be proper format: HH:MM');
    }

    if (mustInclude.length > 0)
      return response.status(400).json({
        error:
          'You must include these BODY parameters: ' +
          JSON.stringify(mustInclude),
      });

    const newEvent = new Events();

    // image upload
    const uploadImages = [];
    if (files) {
      for (let x = 0; x < files.length; x++) {
        const blob = files[x];
        await this.imageService
          .uploadImageAsBlob(blob.buffer, blob.mimetype)
          .then((result) => {
            uploadImages.push(result);
          });
      }
      newEvent.image = uploadImages;
    }

    newEvent.title = title !== null ? title : '';
    newEvent.location = location !== null ? location : '';
    newEvent.date = date !== null ? date : '';
    newEvent.time = time !== null ? time : '';
    newEvent.price = price !== null ? price : '';
    newEvent.host = hostId;
    newEvent.description = description !== null ? description : '';

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

      newEvent.organization = organization;
    }

    // for adding host
    const host = await this.profilesRepository
      .createQueryBuilder('profiles')
      .where('profiles.id = :hostId', { hostId })
      .getOne();

    // make sure profile exists
    if (host == undefined || host == null)
      return response.status(400).json({
        error: `this host (profile id ${hostId}) does not exist`,
      });

    newEvent.host = host;

    globalThis.Logger.log({ level: 'info', message: 'New Event' });
    globalThis.Logger.log({ level: 'info', message: JSON.stringify(newEvent) });

    // try {
    const data = await this.eventsRepository.save(newEvent);
    globalThis.Logger.log({
      level: 'info',
      message: 'New Event Response ' + JSON.stringify(data),
    });
    return response.status(200).json(data);
    // // } catch (e) {
    //   globalThis.Logger.log({
    //     level: 'info',
    //     message: 'New Profile Response Error' + JSON.stringify(e),
    //   });
    //   return response.status(400).json({ error: e });
    // // }
  }

  public async updateEvent(files, request, response) {
    const {
      title,
      location,
      date,
      time,
      price,
      description,
      attendee,
      orgId,
    } = request.body;
    const { id } = request.params;

    // fetch current profile from db
    let currentEvent = await this.eventsRepository
      .createQueryBuilder('events')
      .leftJoin('events.image', 'image')
      .leftJoin('events.host', 'host')
      .leftJoin('events.attendees', 'attendees')
      .select([
        'events',
        'image',
        'host.id',
        'host.first_name',
        'host.linkedin_username',
        'host.occupation',
        'attendees.id',
        'attendees.first_name',
        'attendees.linkedin_username',
        'attendees.occupation',
      ])
      .where('events.id = :id', { id })
      .getOne();
    // make sure upcycler exists
    if (currentEvent == undefined)
      return response
        .status(400)
        .json({ error: 'this eventId does not exist' });

    const updatedEvent = new Events();

    // type check all NOT Nullable
    let mustInclude = [];
    if (title != undefined) updatedEvent.title = title;
    if (location != undefined) updatedEvent.location = location;
    if (date != undefined) {
      // type check date
      if (!validateDate(date))
        mustInclude.push('date must be proper format: DD/MM/YYYY');
      updatedEvent.date = date;
    }
    if (time != undefined) {
      //type check time
      if (!validateTime(time))
        mustInclude.push('time must be proper format: HH:MM');
      updatedEvent.time = time;
    }

    // for returning improper time or date
    if (mustInclude.length > 0)
      return response.status(400).json({
        error:
          'You must include these BODY parameters: ' +
          JSON.stringify(mustInclude),
      });

    // image upload
    const uploadImages = [];
    if (files) {
      for (let x = 0; x < files.length; x++) {
        const blob = files[x];
        await this.imageService
          .uploadImageAsBlob(blob.buffer, blob.mimetype)
          .then((result) => {
            uploadImages.push(result);
          });
      }
      updatedEvent.image = uploadImages;
    }

    if (price != undefined) updatedEvent.price = price;
    if (description != undefined) updatedEvent.description = description;

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

      updatedEvent.organization = organization;
    }

    let newAttendees = [];
    // attendees must be an array
    if (attendee != undefined) {
      const profile = await this.profilesRepository
        .createQueryBuilder('profiles')
        .where('profiles.id = :attendee', { attendee })
        .getOne();

      // make sure profile exists
      if (profile == undefined || profile == null)
        return response.status(400).json({
          error: `this attendee (profile id ${attendee}) does not exist`,
        });
      // if  the event already has attendees, get them & just push new one
      if (currentEvent.attendees != null) newAttendees = currentEvent.attendees;

      newAttendees.push(profile);
      console.log('new attendee is ' + profile);
      // updatedEvent.attendees = newAttendees;
    }

    globalThis.Logger.log({ level: 'info', message: 'Update Event' });
    globalThis.Logger.log({
      level: 'info',
      message: JSON.stringify(updatedEvent),
    });

    // merge new info into existing hire
    // ** we need to merge instead of usual keyword 'update'
    // because of images (oneToMany external relationship)
    // this case is not supported by the keyword 'update'
    this.eventsRepository.merge(currentEvent, updatedEvent);
    // save it
    const data = await this.eventsRepository.save(currentEvent);

    globalThis.Logger.log({
      level: 'info',
      message: 'Updated Event Response ' + JSON.stringify(currentEvent),
    });
    return response.status(200).json(currentEvent);
  }

  async deleteEvent(request, response): Promise<Events[]> {
    const { id } = request.params;
    globalThis.Logger.log({ level: 'info', message: 'Remove event ' + id });
    const event = await this.eventsRepository.delete({ id });
    globalThis.Logger.log({
      level: 'info',
      message: 'Remove Event Response ' + JSON.stringify(event),
    });
    return response.status(200).json(event);
  }
}
