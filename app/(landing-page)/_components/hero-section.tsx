import {getUser} from '@/lib/auth';
import {HeroActions} from './hero-actions';

export const HeroSection = async () => {
  const {user} = await getUser();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-2xl py-16 sm:py-32 lg:py-44">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full border-0 bg-muted px-3 py-1 text-sm leading-6 text-muted-foreground">
            Work in progress
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Survey app built with Next.js 14 App Router and server actions
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A full-stack application where you can build, share, and analyse
            surveys. Built with Next.js 14, Prisma, and PlanetScale.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <HeroActions user={user} />
          </div>
        </div>
      </div>
    </section>
  );
};
