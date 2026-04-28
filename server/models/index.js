import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true, id: false });

const layoutSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  agent_id: { type: Number, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  total_plots: { type: Number, default: 0 }
}, { timestamps: true, id: false });

const plotSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  layout_id: { type: Number, required: true },
  plot_number: { type: String, required: true },
  size_sqft: { type: Number },
  price: { type: Number },
  facing: { type: String, enum: ['North', 'South', 'East', 'West'] },
  status: { type: String, enum: ['available', 'booked', 'sold'], default: 'available' },
  grid_x: { type: Number, required: true },
  grid_y: { type: Number, required: true },
  grid_w: { type: Number, default: 1 },
  grid_h: { type: Number, default: 1 }
}, { timestamps: true, id: false });

const bookingSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  layout_id: { type: Number, required: true },
  plot_id: { type: Number, required: true },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_phone: { type: String, required: true },
  visit_date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true, id: false });

// Auto-increment IDs since we are migrating from SQL and the frontend expects numerical IDs.
// For a production app, we would use _id, but we need to maintain compatibility with the frontend fast.

agentSchema.pre('save', async function() {
  if (this.isNew && !this.id) {
    const last = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
    this.id = last && last.id ? last.id + 1 : 1;
  }
});
layoutSchema.pre('save', async function() {
  if (this.isNew && !this.id) {
    const last = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
    this.id = last && last.id ? last.id + 1 : 1;
  }
});
plotSchema.pre('save', async function() {
  if (this.isNew && !this.id) {
    const last = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
    this.id = last && last.id ? last.id + 1 : 1;
  }
});
bookingSchema.pre('save', async function() {
  if (this.isNew && !this.id) {
    const last = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
    this.id = last && last.id ? last.id + 1 : 1;
  }
});

export const Agent = mongoose.model('Agent', agentSchema);
export const Layout = mongoose.model('Layout', layoutSchema);
export const Plot = mongoose.model('Plot', plotSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
