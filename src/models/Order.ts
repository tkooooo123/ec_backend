import mongoose, { Document, Schema, model, Types } from 'mongoose'

export interface IOrderItem {
  product: Types.ObjectId
  quantity: number
  price: number
}

export interface IShipping {
  name: string
  phone: string
  address: string
  email: string
  message?: string
}

export interface IOrder extends Document {
  user: Types.ObjectId
  items: IOrderItem[]
  total: number
  shipping: IShipping
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  payment: 'credit_card' | 'cash_on_delivery'
  sn: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
)

const ShippingSchema = new Schema<IShipping>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String }
  },
  { _id: false }
)

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    shipping: { type: ShippingSchema, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipping','shipped', 'completed', 'cancelled'],
      default: 'pending'
    },
    payment: {
      type: String,
      enum: ['credit_card', 'cash_on_delivery'],
      default: 'credit_card'
    },
    sn: { type: String, default: '' }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Order as mongoose.Model<IOrder> ||
  model<IOrder>('Order', OrderSchema)