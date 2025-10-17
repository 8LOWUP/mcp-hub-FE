'use client';

import { useTranslations } from 'next-intl';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  Shield, 
  Users, 
  Zap,
  Globe,
  Heart,
  Star,
  ChevronRight
} from 'lucide-react';

export default function SupportPage() {
  const t = useTranslations('Support');

  const supportSections = [
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "자주 묻는 질문",
      description: "MCP Hub 사용법과 관련된 자주 묻는 질문들을 확인해보세요.",
      items: [
        "MCP란 무엇인가요?",
        "어떻게 MCP를 업로드하나요?",
        "채팅 기능은 어떻게 사용하나요?",
        "계정 설정은 어디서 하나요?"
      ]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "문의하기",
      description: "궁금한 점이 있으시면 언제든지 문의해주세요.",
      items: [
        "기술 지원: support@mcphub.com",
        "비즈니스 문의: business@mcphub.com",
        "버그 신고: bug@mcphub.com",
        "피드백: feedback@mcphub.com"
      ]
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "커뮤니티",
      description: "다른 사용자들과 소통하고 정보를 공유해보세요.",
      items: [
        "Discord 서버 참여",
        "GitHub Discussions",
        "공식 블로그",
        "소셜 미디어 팔로우"
      ]
    }
  ];

  const policies = [
    {
      title: "서비스 이용약관",
      description: "MCP Hub 서비스 이용에 관한 약관입니다.",
      lastUpdated: "2024.01.15"
    },
    {
      title: "개인정보처리방침",
      description: "개인정보 수집, 이용, 보관에 관한 정책입니다.",
      lastUpdated: "2024.01.15"
    },
    {
      title: "쿠키 정책",
      description: "웹사이트에서 사용하는 쿠키에 관한 정책입니다.",
      lastUpdated: "2024.01.15"
    },
    {
      title: "지적재산권 정책",
      description: "MCP 및 관련 콘텐츠의 지적재산권에 관한 정책입니다.",
      lastUpdated: "2024.01.15"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            MCP Hub 지원 센터
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            MCP Hub를 더 잘 활용할 수 있도록 도와드립니다. 
            궁금한 점이 있으시면 언제든지 문의해주세요.
          </p>
        </div>

        {/* Service Introduction */}
        <div className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-slate-900 dark:text-white">
              <Zap className="w-6 h-6 text-yellow-500" />
              MCP Hub 소개
            </h2>
          </div>
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
                  <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">글로벌 MCP 마켓플레이스</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  전 세계 개발자들이 만든 다양한 MCP를 한 곳에서 발견하고 사용하세요.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">커뮤니티 중심</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  개발자들과 소통하며 새로운 아이디어를 공유하고 협업하세요.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">안전하고 신뢰할 수 있는</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  모든 MCP는 검증 과정을 거쳐 안전하게 제공됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Sections */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {supportSections.map((section, index) => (
            <div key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{section.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{section.description}</p>
              </div>
              <div>
                <ul className="space-y-2 mb-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <SecondaryButton className="w-full">
                  자세히 보기
                </SecondaryButton>
              </div>
            </div>
          ))}
        </div>

        {/* Policies Section */}
        <div className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white mb-2">
              <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              정책 및 약관
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              MCP Hub 서비스 이용에 관한 중요한 정책들을 확인하세요.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {policies.map((policy, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {policy.title}
                  </h3>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full">
                    {policy.lastUpdated}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  {policy.description}
                </p>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                  자세히 보기 →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            여전히 도움이 필요하신가요?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            위의 정보로도 해결되지 않는 문제가 있으시면 언제든지 문의해주세요. 
            빠른 시간 내에 답변드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton additionalClassName="bg-blue-600 hover:bg-blue-700 text-white">
              <Mail className="w-4 h-4 mr-2" />
              이메일로 문의하기
            </PrimaryButton>
            <SecondaryButton>
              <MessageSquare className="w-4 h-4 mr-2" />
              실시간 채팅
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
