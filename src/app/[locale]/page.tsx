import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import ThemeToggle from '@/components/ui/theme-toggle';
import PrimaryButton from '@/components/ui/PrimaryButton';
import "../globals.css"
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import SecondaryButton from '@/components/ui/SecondaryButton';

export default function LandingPage() {
  const t = useTranslations('LandingPage');
  return (
    <div className=''>
      <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link>
      <div className='flex justify-center items-center'>
        <ThemeToggle />
        <LocaleSwitcher/>
        <PrimaryButton
          size='sm'
        >
          + New Chat
        </PrimaryButton>
        <SecondaryButton
          variant='secondary'
        >
          Upload
        </SecondaryButton>
      </div>
      <div className='text-primary'>Primary 텍스트</div>
      <div className='text-secondary'>Secondary 텍스트</div>
      <div className='text-muted'>Muted 텍스트</div>
      <div className='text-disabled'>Disabled 텍스트</div>
    </div>
  );
}
