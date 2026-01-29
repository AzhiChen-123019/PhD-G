import { NextRequest, NextResponse } from 'next/server';
import { MembershipLevel, MEMBERSHIP_PLANS } from '@/lib/membership';

// 会员订单接口
interface MembershipOrder {
  id: string;
  userId: string;
  membershipLevel: MembershipLevel;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  expiresAt: string;
}

// 内存存储（服务器端使用）
let membershipOrders: MembershipOrder[] = [];

// 获取所有会员订单
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: membershipOrders,
      total: membershipOrders.length
    });
  } catch (error) {
    console.error('Error fetching membership orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch membership orders'
      },
      { status: 500 }
    );
  }
}

// 创建新的会员订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    if (!body.userId || !body.membershipLevel) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }
    
    // 获取会员计划信息
    const membershipPlan = MEMBERSHIP_PLANS.find(plan => plan.level === body.membershipLevel);
    if (!membershipPlan) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid membership level'
        },
        { status: 400 }
      );
    }
    
    // 创建新订单
    const newOrder: MembershipOrder = {
      id: `order-${Date.now()}`,
      userId: body.userId,
      membershipLevel: body.membershipLevel,
      amount: membershipPlan.price,
      paymentMethod: body.paymentMethod || 'credit_card',
      status: 'completed',
      createdAt: new Date().toISOString(),
      expiresAt: membershipPlan.duration === 'lifetime' 
        ? new Date(Date.now() + 99 * 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    // 保存到内存存储
    membershipOrders.unshift(newOrder);
    
    return NextResponse.json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating membership order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create membership order'
      },
      { status: 500 }
    );
  }
}

// 更新会员订单
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing order ID'
        },
        { status: 400 }
      );
    }
    
    // 找到并更新订单
    const orderIndex = membershipOrders.findIndex(order => order.id === body.id);
    if (orderIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      );
    }
    
    const updatedOrder = {
      ...membershipOrders[orderIndex],
      ...body
    };
    
    membershipOrders[orderIndex] = updatedOrder;
    
    return NextResponse.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating membership order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update membership order'
      },
      { status: 500 }
    );
  }
}

// 删除会员订单
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing order ID'
        },
        { status: 400 }
      );
    }
    
    // 过滤掉要删除的订单
    const filteredOrders = membershipOrders.filter(order => order.id !== id);
    
    if (filteredOrders.length === membershipOrders.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      );
    }
    
    membershipOrders = filteredOrders;
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting membership order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete membership order'
      },
      { status: 500 }
    );
  }
}
