import {useTranslations} from 'next-intl';
import "../globals.css"
import MarketGrid from '@/features/market/components/grid/MarketGrid';
import LandingChatStartButton from '@/features/landing/components/LandingChatStartButton';

export default function LandingPage() {
  const t = useTranslations('LandingPage');
  const mcpDate = [
    {
      id : "notionmcp",
      title : "Notion MCP",
      description : "노션의 다양한 기능을 데이터 베이스를 활용하여 만든 시스템입니다.",
      saved : true,
      usersCount:2048,
    },
    {
      id : "notionmcp1",
      title : "Notion MCP2",
      description : "노션의 다양한 기능을 데이터 베이스를 활용하여 만든 시스템입니다.2",
      saved : true,
      usersCount:2048,
    },
  ]

  return (
    <div className='flex-1 h-full bg-surface-1 pt-20'>
      <div className="mt-6 flex flex-col justify-center items-center">
          <h1 className='text-4xl py-10'>MCP HUB</h1>
          <LandingChatStartButton />
          <MarketGrid items={mcpDate} >
          </MarketGrid>
          
      </div>

    </div>
  );
}

