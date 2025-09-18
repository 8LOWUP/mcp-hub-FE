import { useTranslations } from "next-intl";

const ChatPage = () => {
    const t = useTranslations('ChatPage');

    return (
        <div>
            테스트입니다.
            {t("title")}
        </div>
    );
}

export default ChatPage;