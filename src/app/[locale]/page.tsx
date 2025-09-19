import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import ThemeToggle from '@/components/ui/theme-toggle';
import PrimaryButton from '@/components/ui/PrimaryButton';
import "../globals.css"
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import SecondaryButton from '@/components/ui/SecondaryButton';
import Example from '@/components/modal/Example';
import MCPCard from "@/components/container/McpCard";
import TextContainer from '@/components/container/TextContainer'

export default function LandingPage() {
  const t = useTranslations('LandingPage');
  return (
    <div className='bg-surface-1'>
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
        <Example/>
      </div>
      <div className='flex flex-col'>
        <TextContainer className='max-h-80 w-120'>
          どこまでも続つづくような青あおの季き節せつは
          도코마데모 츠즈쿠 요나 아오노 키세츠와
          영원히 계속될 것만 같은 푸른 계절은
          四よつ並ならぶ眼まなこの前まえを遮さえぎるものは何なにもない
          요츠나라부 마나코노 마에오 사에기루 모노와 나니모 나이

        </TextContainer>
      </div>
      <div className='text-primary'>Primary 텍스트</div>
      <div className='text-secondary'>Secondary 텍스트</div>
      <div className='text-muted'>Muted 텍스트</div>
      <div className='text-disabled'>Disabled 텍스트</div>
        <div className="mt-6 flex flex-col justify-center">

            <MCPCard
                id="notionmcp"
                title="Notion MCP"
                description="노션의 다양한 기능을 데이터 베이스를 활용하여 만든 시스템입니다."
                saved = {true}
                usersCount={2048}
            />
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

