import { NextRequest, NextResponse } from 'next/server';
import { JobStatus, JobCategory } from '@/lib/job-model';
import { connectToDB } from '@/lib/mongoose';

// 动态导入Job模型，避免在模块加载时出错
let Job: any;
try {
  Job = require('@/models/Job').default;
} catch (error) {
  console.error('Failed to load Job model:', error);
  Job = null;
}

export async function GET(request: NextRequest) {
  try {
    const dbConnection = await connectToDB();
    
    // 检查数据库连接和Job模型是否可用
    if (!dbConnection || !Job) {
      const { searchParams } = request.nextUrl;
      const id = searchParams.get('id');
      
      // 如果请求单个岗位但数据库连接失败或模型不可用，返回错误
      if (id) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
      }
      
      // 如果请求所有岗位但数据库连接失败或模型不可用，返回空数组
      return NextResponse.json([], { status: 200 });
    }
    
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    
    // 按id查询单个岗位
    if (id) {
      const job = await Job.findById(id);
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json(job, { status: 200 });
    }
    
    const query: any = {};
    
    // 按类别筛选
    if (category && category !== 'all') {
      query['tags.category'] = category;
    }
    
    // 按状态筛选
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const filteredJobs = await Job.find(query);
    return NextResponse.json(filteredJobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const jobData = await request.json();
    
    const newJob = new Job({
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      salary: jobData.salary,
      type: jobData.type,
      deadline: jobData.deadline,
      description: jobData.description,
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      skills: jobData.skills || [],
      postedTime: new Date().toISOString(),
      relevanceScore: jobData.relevanceScore || 0,
      url: jobData.url || '',
      source: jobData.source || 'manual',
      viewCount: 0,
      applyCount: 0,
      rating: jobData.rating || 0,
      experience: jobData.experience || '',
      degree: jobData.degree || '',
      status: JobStatus.ACTIVE,
      libraryType: jobData.libraryType || 'public',
      isMatched: false,
      tags: jobData.tags || {
        category: jobData.type === 'university' ? JobCategory.UNIVERSITY : JobCategory.ENTERPRISE,
        subType: 'other'
      }
    });
    
    await newJob.save();
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = request.nextUrl;
    const jobId = searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }
    
    const jobData = await request.json();
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { ...jobData, updatedAt: new Date().toISOString() },
      { new: true }
    );
    
    if (!updatedJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = request.nextUrl;
    const jobId = searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }
    
    const deletedJob = await Job.findByIdAndDelete(jobId);
    
    if (!deletedJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
