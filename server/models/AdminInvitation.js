import mongoose from 'mongoose';

const AdminInvitationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    token: {
      type: String,
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Fix for Mongoose 7+ - replace remove() with deleteOne()
AdminInvitationSchema.method(
  'remove',
  async function () {
    return this.deleteOne();
  },
  { suppressWarning: true }
); // This suppresses the Mongoose warning

const AdminInvitation = mongoose.model(
  'AdminInvitation',
  AdminInvitationSchema
);

export default AdminInvitation;
