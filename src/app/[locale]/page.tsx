import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import ThemeToggle from '@/components/ui/theme-toggle';
import PrimaryButton from '@/components/ui/PrimaryButton';
import "../globals.css"
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import SecondaryButton from '@/components/ui/SecondaryButton';
import TextContainer from '@/components/container/TextContainer';
import Example from '@/components/modal/Example';

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
        <Example/>
      </div>
      <div className='flex flex-col'>
        <TextContainer className='max-h-80 w-120'>
          どこまでも続つづくような青あおの季き節せつは
          도코마데모 츠즈쿠 요나 아오노 키세츠와
          영원히 계속될 것만 같은 푸른 계절은
          四よつ並ならぶ眼まなこの前まえを遮さえぎるものは何なにもない
          요츠나라부 마나코노 마에오 사에기루 모노와 나니모 나이
          네 개 나란히 있는 눈앞을 가로막는 건 아무것도 없어
          アスファルト、蝉せみ時雨しぐれを反はん射しゃして
          아스화루토 세미시구레오 한샤시테
          아스팔트가 요란한 매미 소리를 반사해서
          君きみという沈ちん黙もくが聞きこえなくなる
          키미토 유우 친모쿠가 키코에나쿠나루
          너라는 침묵이 들리지 않아
          この日ひ々びが色いろ褪あせる
          코노 히비가 이로아세루
          이 날들이 빛바래서
          僕ぼくと違ちがう君きみの匂においを知しってしまっても
          보쿠토 치가우 키미노 니오이오 싯테 시맛테모
          나와 다른 너의 냄새를 알아버려도
          置おき忘わすれてきた永えい遠えんの底そこに
          오키와스레테 키타 에이엔노 소코니
          두고 온 영원의 밑바닥에
          今いまでも青あおが棲すんでいる
          이마데모 아오가 슨데이루
          지금도 푸르름이 살고 있어
          今いまでも青あおは澄すんでいる
          이마데모 아오와 슨데이루
          지금도 푸르름은 맑게 있어
          どんな祈いのりも言こと葉ばも
          돈나 이노리모 코토바모
          그 어떤 기도도, 말도
          近ちかづけるのに届とどかなかった
          치카즈케루노니 토도카나캇타
          다가갈 수 있었는데도 끝내 닿지 않았어
          まるで静しずかな恋こいのような
          마루데 시즈카나 코이노 요-나
          마치 조용한 사랑과 같은
          頬ほほを伝つたった夏なつのような色いろの中なか
          호호오 츠탓타 나츠노 요-나 이로노 나카
          뺨을 타고 흘러내린 여름 같은 빛깔 속에
          君きみを呪のろう言こと葉ばがずっと喉のどの奥おくにつかえてる
          키미오 노로우 코토바가 즛토 노도노 오쿠니 츠카에테루
          너를 저주하는 말이 계속 목 안에 걸려 있어
          ＇また会あえるよね＇って
          마타 아에루요넷테
          “다시 만날 수 있겠지”라는
          声こえにならない声こえ
          코에니 나라나이 코에
          차마 하지 못한 말
          昼ひる下さがり、じめつく風かぜの季き節せつは
          히루사가리 지메츠쿠 카제노 키세츠와
          오후 즈음에, 습기찬 바람이 부는 계절은
          思おもい馳はせる、まだ何なに者ものでもなかった僕ぼくらの肖しょう像ぞう
          오모이 하세루 마다 나니모노데모 나캇타 보쿠라노 쇼-조-
          생각하게 해, 아직 그 누구도 아니었던 우리들의 모습을
          何なにもかも分わかち合あえたはずだった
          나니모카모 와카치아에타 하즈닷타
          모든 것을 서로 나눌 수 있었을 텐데
          あの日ひから少すこしずつ
          아노 히카라 스코시즈츠
          그날부터 조금씩
          きみと違ちがう僕ぼくと言いう呪のろいが肥ふとっていく
          키미토 치가우 보쿠토 유- 노로이가 후톳테이쿠
          너와 다른 나라는 저주가 커져만 갔어
          きみの笑え顔がおの奥おくの憂うれいを
          키미노 에가오노 오쿠노 우레이오
          너의 미소 속의 근심을
          見み落おとしたこと、悔くやみ尽つくして
          미오토시타 코토 쿠야미 츠쿠시테
          간과했던 것을 후회하며
          徒あだ花ばなと咲さいて散ちっていくきみに
          아다바나토 사이테 칫테이쿠 키미니
          수꽃[2]으로 피어나 지는 너에게
          さよなら
          사요나라
          안녕
          今いまでも青あおが棲すんでいる
          이마데모 아오가 슨데이루
          지금도 푸르름이 살고 있어
          今いまでも青あおは澄すんでいる
          이마데모 아오와 슨데이루
          지금도 푸르름은 맑게 있어
          どんな祈いのりも言こと葉ばも
          돈나 이노리모 코토바모
          그 어떤 기도도, 말도
          近ちかづけるのに届とどかなかった
          치카즈케루노니 토도카나캇타
          다가갈 수 있었는데도 끝내 닿지 않았어
          まるで静しずかな恋こいのような
          마루데 시즈카나 코이노 요-나
          마치 조용한 사랑과 같은
          頬ほほを伝つたった夏なつのような色いろの中なか
          호호오 츠탓타 나츠노 요-나 이로노 나카
          뺨을 타고 흘러내린 여름 같은 빛깔 속에
          君きみを呪のろう言こと葉ばがずっと喉のどの奥おくにつかえてる
          키미오 노로우 코토바가 즛토 노도노 오쿠니 츠카에테루
          너를 저주하는 말이 계속 목 안에 걸려 있어
          ＇また会あえるよね＇って
          마타 아에루요넷테
          “다시 만날 수 있겠지”라는
          声こえにならない声こえ
          코에니 나라나이 코에
          차마 하지 못한 말
          無む限げんに膨ぼう張ちょうする銀ぎん河がの星ほしの
          무겐니 보-쵸-스루 긴가노 호시노
          무한히 팽창하는 은하의 별들처럼
          粒つぶのように指ゆびの隙すき間まを零こぼれた
          츠부노 요-니 유비노 스키마오 코보레타
          손가락 사이로 흘러넘쳤어
        </TextContainer>
      </div>
      <div className='text-primary'>Primary 텍스트</div>
      <div className='text-secondary'>Secondary 텍스트</div>
      <div className='text-muted'>Muted 텍스트</div>
      <div className='text-disabled'>Disabled 텍스트</div>
    </div>
  );
}
