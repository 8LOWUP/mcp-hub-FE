import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import ThemeToggle from '@/components/ui/theme-toggle';
import PrimaryButton from '@/components/ui/PrimaryButton';
import "../globals.css"
import { LocaleToggle } from '@/components/ui/locale-switcher';

export default function LandingPage() {
  const t = useTranslations('LandingPage');
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link>
      <ThemeToggle />
      <LocaleToggle/>
      <PrimaryButton
        size='sm'
      >
        + New Chat
      </PrimaryButton>
      <div className='text-primary'>Primary 텍스트</div>
      <div className='text-secondary'>Secondary 텍스트</div>
      <div className='text-muted'>Muted 텍스트</div>
      <div className='text-disabled'>Disabled 텍스트</div>
    </div>
  );
}
