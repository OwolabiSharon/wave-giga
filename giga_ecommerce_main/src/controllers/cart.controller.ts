// write an open ts controller for cart
// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { CartService } from '../services/cart.service';
// import { CreateCartDto } from '../dto/create-cart.dto';
// import { UpdateCartDto } from '../dto/update-cart.dto';

// @Controller('cart')

// export class CartController {
//   constructor(private readonly cartService: CartService) {}

//   @Post()
//   create(@Body() createCartDto: CreateCartDto) {
//     return this.cartService.create(createCartDto);
//   }

//   @Get()
//   findAll() {
//     return this.cartService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.cartService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
//     return this.cartService.update(+id, updateCartDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.cartService.remove(+id);
//   }
// }

// Path: giga_ecommerce_main\src\services\cart.service.ts

// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class CartService {
//   create(createCartDto: any) {
//     return 'This action adds a new cart';
//   }

//   findAll() {
//     return `This action returns all cart`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} cart`;
//   }

//   update(id: number, updateCartDto: any) {
//     return `This action updates a #${id} cart`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} cart`;
//   }

// }
