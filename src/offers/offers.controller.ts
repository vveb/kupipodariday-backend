import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createNewOffer(
    @Body() createOfferDto: CreateOfferDto,
    @AuthUser() user: User,
  ) {
    return this.offersService.createNewOffer(createOfferDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllOffers() {
    return this.offersService.findAllOffers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOfferById(@Param('id') id: number) {
    return this.offersService.findOfferById(id);
  }
}
