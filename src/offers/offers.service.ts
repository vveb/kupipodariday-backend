import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import relations from '../utils/relations';
import { ERR_MSG } from '../utils/error-messages';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async createNewOffer(createOfferDto: CreateOfferDto, user: User) {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findWishById(itemId);
    if (!wish) {
      throw new NotFoundException(ERR_MSG.OFFER.NOT_FOUND_WISH);
    }
    if (wish.owner.id === user.id) {
      throw new ForbiddenException(ERR_MSG.OFFER.SELF_SUPPORT);
    }
    if (
      amount > wish.price ||
      amount > Number(wish.price) - Number(wish.raised)
    ) {
      throw new ForbiddenException(ERR_MSG.OFFER.TOO_MUCH);
    }
    if (wish.price === wish.raised) {
      throw new ForbiddenException(ERR_MSG.OFFER.COLLECTED);
    }
    await this.wishesService.updateWishByRaise(
      wish.id,
      Number(wish.raised) + Number(amount),
    );
    return await this.offersRepository.save({
      ...createOfferDto,
      user,
      item: wish,
    });
  }

  findAllOffers() {
    return this.offersRepository.find({
      relations: relations.findOffers,
    });
  }

  async findOfferById(id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: relations.findOffers,
    });
    if (!offer) {
      throw new NotFoundException(ERR_MSG.OFFER.NOT_FOUND);
    }
    return offer;
  }
}
