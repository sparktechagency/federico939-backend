import { model, Schema } from 'mongoose';
import { TRule } from './rule.interface';


const ruleSchema = new Schema<TRule>(
     {
          content: {
               type: String,
               required: true,
          },
          type: {
               type: String,
               enum: ['privacy', 'terms', 'about'],
               select: 0,
          },
     },
     {
          timestamps: true,
          versionKey: false,
     },
);

export const Rule = model<TRule>('Rule', ruleSchema);
