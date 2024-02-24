import {DESIGNER_LINKS} from '@/lib/constants/links';

export const replaceLinkHrefs = (
  links: typeof DESIGNER_LINKS,
  surveyId: string,
) => {
  return links.map((link) => {
    const href = link.href.replace(':id', surveyId as string);
    return {...link, href};
  });
};
