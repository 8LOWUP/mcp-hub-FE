import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import ThemeToggle from '@/components/ui/theme-toggle';
import PrimaryButton from '@/components/ui/PrimaryButton';
import "../globals.css"
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import SecondaryButton from '@/components/ui/SecondaryButton';
import MCPCard from "@/components/container/McpCard";

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
        <div className="mt-6 flex justify-center">

            <MCPCard
                id="notionmcp"
                title="Notion MCP"
                description="노션의 다양한 기능을 데이터 베이스를 활용하여 만든 시스템입니다."
                saved = {true}
                usersCount={2048}
            />
        </div>
    </div>
  );
}

