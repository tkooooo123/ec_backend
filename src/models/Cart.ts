import mongoose, { Document, Schema } from 'mongoose'
import type { IProduct } from './Product'
import type { IUser } from './User'

// 定義 CartItem 的 interface
export interface ICartItem {
  product: mongoose.Types.ObjectId | IProduct
  quantity: number
  price: number
}

// 定義 Cart 的 interface
export interface ICart extends Document {
  user: mongoose.Types.ObjectId | IUser
  items: ICartItem[]
  createdAt: Date
  updatedAt: Date
}

// 建立 CartItem 的 Schema
const CartItemSchema: Schema<ICartItem> = new Schema<ICartItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
)

// 建立 Cart 的 Schema
const CartSchema: Schema<ICart> = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // 一個 user 只會有一個 cart
    },
    items: {
      type: [CartItemSchema],
      default: []
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
)

export default (mongoose.models.Cart as mongoose.Model<ICart>) || mongoose.model<ICart>('Cart', CartSchema)