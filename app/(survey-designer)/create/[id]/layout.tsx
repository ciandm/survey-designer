import {redirect} from 'next/navigation';
import {DesignerToolbar} from '@/components/designer-toolbar';
import {tabConfig} from '@/config/designer';
import {getUser} from '@/lib/auth';
import {getSiteUrl} from '@/lib/hrefs';

export default async function SurveyDesignerLayout({
  children,
}: React.PropsWithChildren) {
  const {user} = await getUser();

  if (!user) {
    redirect(getSiteUrl.loginPage());
  }

  return (
    <div className="flex min-h-screen flex-col" vaul-drawer-wrapper="">
      <DesignerToolbar
        tabs={tabConfig}
        homeHref={getSiteUrl.dashboardPage()}
        user={user}
      />
      {children}
    </div>
  );
}
