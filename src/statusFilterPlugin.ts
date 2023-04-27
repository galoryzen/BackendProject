import { Schema } from 'mongoose';

const statusFilterPlugin = (schema: Schema) => {
  schema.pre('find', function () {
    this.where({ status: { $ne: false } });
  });

  schema.pre('findOne', function () {
    this.where({ status: { $ne: false } });
  });

  schema.pre('findOneAndUpdate', function () {
    this.where({ status: { $ne: false } });
  });
};

export default statusFilterPlugin;
