import {HamburgerMenu} from './hamburger-menu';
import {NavLinks} from './nav-links';
import {PublishButton} from './publish-button';
import {SaveChanges} from './save-changes';
import {ShareSurvey} from './share-survey';
import {SurveyActions} from './survey-actions';

export const Header = () => {
  return (
    <header className="flex h-14 flex-1 items-center justify-between border-b bg-card">
      <NavLinks />
      <HamburgerMenu />
      <div className="ml-auto mr-4 flex space-x-2">
        <SaveChanges />
        <ShareSurvey />
        <PublishButton />
        <SurveyActions />
      </div>
    </header>
  );
};
