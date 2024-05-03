import mongoose from "mongoose";

const taskTimeTrackingSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
    },
    startTime: {
      type: Date,
    },
    duration: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TimeTrack", taskTimeTrackingSchema);
