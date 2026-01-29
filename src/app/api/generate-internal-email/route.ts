import { NextRequest, NextResponse } from 'next/server';
import { generateInternalEmail } from '@/lib/serverInternalEmail';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    
    const internalEmail = await generateInternalEmail(username);
    
    return NextResponse.json({ internalEmail }, { status: 200 });
  } catch (error) {
    console.error('Error generating internal email:', error);
    return NextResponse.json({ error: 'Failed to generate internal email' }, { status: 500 });
  }
}
