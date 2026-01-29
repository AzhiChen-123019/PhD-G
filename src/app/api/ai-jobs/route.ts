// AI岗位分析API
// 提供智能岗位抓取、分析和匹配服务

import { NextRequest, NextResponse } from 'next/server';
import { aiIntegrationService, AIScrapeOptions, AIEnhancedJob } from '../../../lib/ai-integration';

// 定义API请求和响应类型
interface JobScrapeRequest {
  options: AIScrapeOptions;
}

interface JobMatchRequest {
  jobs: AIEnhancedJob[];
  userProfile: any;
}

interface JobAnalyzeRequest {
  jobs: any[];
  options: AIScrapeOptions;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 处理POST请求
export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'scrapeJobs':
        return handleScrapeJobs(data);
      case 'matchJobs':
        return handleMatchJobs(data);
      case 'analyzeJobs':
        return handleAnalyzeJobs(data);
      case 'getJobAnalysis':
        return handleGetJobAnalysis(data);
      default:
        return NextResponse.json(
          { success: false, error: '未知操作' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API请求处理失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '内部服务器错误' },
      { status: 500 }
    );
  }
}

// 处理GET请求（健康检查）
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI岗位分析API服务正常运行',
    timestamp: new Date().toISOString()
  });
}

/**
 * 处理岗位抓取请求
 */
async function handleScrapeJobs(data: JobScrapeRequest): Promise<NextResponse> {
  try {
    console.log('开始处理岗位抓取请求');
    const { options } = data;

    // 验证请求参数
    if (!options) {
      return NextResponse.json(
        { success: false, error: '缺少抓取选项' },
        { status: 400 }
      );
    }

    // 调用智能岗位抓取服务
    const jobs = await aiIntegrationService.intelligentJobScrape(options);

    return NextResponse.json<APIResponse<AIEnhancedJob[]>>({
      success: true,
      data: jobs,
      message: `成功抓取并分析 ${jobs.length} 个岗位`
    });
  } catch (error) {
    console.error('岗位抓取处理失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '抓取失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理岗位匹配请求
 */
async function handleMatchJobs(data: JobMatchRequest): Promise<NextResponse> {
  try {
    console.log('开始处理岗位匹配请求');
    const { jobs, userProfile } = data;

    // 验证请求参数
    if (!jobs || !Array.isArray(jobs)) {
      return NextResponse.json(
        { success: false, error: '缺少岗位数据' },
        { status: 400 }
      );
    }

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: '缺少用户资料' },
        { status: 400 }
      );
    }

    // 调用智能岗位匹配服务
    const matchedJobs = await aiIntegrationService.intelligentJobMatching(jobs, userProfile);

    return NextResponse.json<APIResponse<AIEnhancedJob[]>>({
      success: true,
      data: matchedJobs,
      message: `成功匹配 ${matchedJobs.length} 个岗位`
    });
  } catch (error) {
    console.error('岗位匹配处理失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '匹配失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理岗位分析请求
 */
async function handleAnalyzeJobs(data: JobAnalyzeRequest): Promise<NextResponse> {
  try {
    console.log('开始处理岗位分析请求');
    const { jobs, options } = data;

    // 验证请求参数
    if (!jobs || !Array.isArray(jobs)) {
      return NextResponse.json(
        { success: false, error: '缺少岗位数据' },
        { status: 400 }
      );
    }

    // 调用批量分析服务
    const analyzedJobs = await aiIntegrationService.batchAnalyzeJobs(jobs, options);

    return NextResponse.json<APIResponse<AIEnhancedJob[]>>({
      success: true,
      data: analyzedJobs,
      message: `成功分析 ${analyzedJobs.length} 个岗位`
    });
  } catch (error) {
    console.error('岗位分析处理失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '分析失败' },
      { status: 500 }
    );
  }
}

/**
 * 处理单个岗位分析请求
 */
async function handleGetJobAnalysis(data: { job: any; options: AIScrapeOptions }): Promise<NextResponse> {
  try {
    console.log('开始处理单个岗位分析请求');
    const { job, options } = data;

    // 验证请求参数
    if (!job) {
      return NextResponse.json(
        { success: false, error: '缺少岗位数据' },
        { status: 400 }
      );
    }

    // 调用分析服务
    const analyzedJob = await aiIntegrationService.batchAnalyzeJobs([job], options);

    return NextResponse.json<APIResponse<AIEnhancedJob>>({
      success: true,
      data: analyzedJob[0],
      message: '成功分析岗位'
    });
  } catch (error) {
    console.error('单个岗位分析处理失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '分析失败' },
      { status: 500 }
    );
  }
}

// 导出API路由配置
export const runtime = "edge";