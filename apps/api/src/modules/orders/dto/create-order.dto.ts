import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { CreateOrderDto as CreateOrderDtoType, ShippingAddressDto } from '@workspace/shared';

class OrderItemInputDto {
  @IsString()
  artworkId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

class ShippingAddressInputDto implements ShippingAddressDto {
  @IsString()
  fullName!: string;

  @IsString()
  phone!: string;

  @IsString()
  addressLine1!: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsString()
  country!: string;
}

export class CreateOrderDto implements CreateOrderDtoType {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressInputDto)
  shippingAddress!: ShippingAddressInputDto;
}
