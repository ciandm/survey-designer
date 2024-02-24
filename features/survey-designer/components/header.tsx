import {HamburgerMenu} from './hamburger-menu';
import {NavLinks} from './nav-links';
import {PublishSurvey} from './publish-survey';
import {SaveChanges} from './save-changes';
import {ShareSurvey} from './share-survey';
import {SurveyActions} from './survey-actions';

export const Header = () => {
  return (
    <header className="flex h-16 flex-1 items-center justify-between border-b bg-white">
      <NavLinks />
      <HamburgerMenu />
      <div className="ml-auto mr-4 flex space-x-2">
        <SaveChanges />
        <ShareSurvey />
        <PublishSurvey />
        <SurveyActions />
      </div>
    </header>
  );
};
