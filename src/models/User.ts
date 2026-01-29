import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  realName: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  education: {
    type: {
      highestDegree: {
        type: String,
        default: '',
      },
      graduationSchool: {
        type: String,
        default: '',
      },
      graduationDate: {
        type: Date,
        default: null,
      },
      major: {
        type: String,
        default: '',
      },
    },
    default: {
      highestDegree: '',
      graduationSchool: '',
      graduationDate: null,
      major: '',
    },
  },
  // 角色和权限字段
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'customer_service', 'enterprise_admin', 'user'],
    default: 'user',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  permissions: {
    type: [String],
    default: [],
  },
  // 企业相关字段
  isEnterprise: {
    type: Boolean,
    default: false,
  },
  enterpriseName: {
    type: String,
    default: '',
  },
  enterpriseIndustry: {
    type: String,
    default: '',
  },
  enterpriseDescription: {
    type: String,
    default: '',
  },
  // 企业规模
  enterpriseSize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: '',
  },
  // 企业官网
  enterpriseWebsite: {
    type: String,
    default: '',
  },
  // 企业Logo
  enterpriseLogo: {
    type: String,
    default: '',
  },
  // 联系人信息
  contactPerson: {
    type: String,
    default: '',
  },
  // 合作状态
  cooperationStatus: {
    type: String,
    enum: ['pending', 'active', 'expired', 'terminated'],
    default: 'pending',
  },
  // 合作开始时间
  cooperationStartDate: {
    type: Date,
    default: null,
  },
  // 合作结束时间
  cooperationEndDate: {
    type: Date,
    default: null,
  },
  // 内部邮箱地址
  internalEmail: {
    type: String,
    unique: true,
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 使用虚拟字段来动态计算degreeVerified状态，避免中间件类型错误
UserSchema.virtual('degreeVerified').get(function() {
  const education = this.education;
  return !!(education.highestDegree && 
           education.graduationSchool && 
           education.graduationDate && 
           education.major);
});

// 确保虚拟字段在转换为JSON时被包含
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false
});

// 确保虚拟字段在转换为Object时被包含
UserSchema.set('toObject', {
  virtuals: true,
  versionKey: false
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;