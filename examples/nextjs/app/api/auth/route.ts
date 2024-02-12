import { NextResponse } from 'next/server';

const POST = async (req: Request) => {
  const data = (await req.json()) as { shortSession: string };

  if (data.shortSession) {
    const response = NextResponse.json({ success: true });

    response.cookies.set('corbado_short_session', data.shortSession, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: true,
    });

    return response;
  } else {
    return NextResponse.error();
  }
};

export { POST };
