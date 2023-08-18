import { CreateChargeDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Stripe } from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'),
    { apiVersion: "2023-08-16" });

  constructor(private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationService: ClientProxy) { }

  // with card from request
  //  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
  //    const paymentMethod = await this.stripe.paymentMethods.create({
  //      type: 'card',
  //      card
  //    });

  //    const paymentIntent = await this.stripe.paymentIntents.create({
  //      payment_method: paymentMethod.id,
  //      amount: amount * 100,
  //      confirm: true,
  //      payment_method_types: ['card'],
  //      currency: 'eur',
  //    });

  //    this.notificationService.emit('notify_email', { email })

  //    return paymentIntent;
  //  }

  //  FIX: with stipe test card
  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: 'pm_card_visa',
    });

    this.notificationService.emit('notify_email', { email, text: `Your payment of ${amount} has completed successfully.` })

    return paymentIntent;
  }
}
