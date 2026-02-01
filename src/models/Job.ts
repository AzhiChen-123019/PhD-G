import mongoose, { Schema, Document } from 'mongoose';
import { JobCategory, UniversityJobSubType, EnterpriseJobSubType, JobStatus, JobLibraryType } from '../lib/job-model';

// 岗位标签子文档结构
interface JobTag {
  category: JobCategory;
  subType: UniversityJobSubType | EnterpriseJobSubType;
}

// MongoDB 岗位文档接口
export interface JobDocument extends Document {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  degree: string;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  postedTime: string;
  relevanceScore: number;
  url: string;
  source: string;
  viewCount: number;
  applyCount: number;
  rating: number;
  deadline: string;
  expireTime?: number;
  tags: JobTag;
  libraryType: JobLibraryType;
  status: JobStatus;
  userId?: string;
  isMatched: boolean;
  displayStartDate?: string;
  displayEndDate?: string;
}

// 岗位标签子文档模式
const jobTagSchema = new Schema<JobTag>({
  category: {
    type: String,
    enum: Object.values(JobCategory),
    required: true
  },
  subType: {
    type: String,
    enum: [...Object.values(UniversityJobSubType), ...Object.values(EnterpriseJobSubType)],
    required: true
  }
});

// 岗位主文档模式
const jobSchema = new Schema<JobDocument>({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  postedTime: {
    type: String,
    required: true
  },
  relevanceScore: {
    type: Number,
    default: 0
  },
  url: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: 'manual'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  applyCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  deadline: {
    type: String,
    required: true
  },
  expireTime: {
    type: Number
  },
  tags: {
    type: jobTagSchema,
    required: true
  },
  libraryType: {
    type: String,
    enum: Object.values(JobLibraryType),
    default: JobLibraryType.PUBLIC
  },
  status: {
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.ACTIVE
  },
  userId: {
    type: String
  },
  isMatched: {
    type: Boolean,
    default: false
  },
  displayStartDate: {
    type: String
  },
  displayEndDate: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret: any) {
      ret.id = doc._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret: any) {
      ret.id = doc._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

// 导出岗位模型
export default mongoose.model<JobDocument>('Job', jobSchema);
