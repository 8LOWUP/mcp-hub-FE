import PrimaryButton from "@/components/ui/PrimaryButton"
import HistoryList from "./HistoryList"


const HistoryContainer = () => {

    return(
        <div className="w-70 flex flex-col justify-between items-center h-full p-4">            
            <HistoryList />
            
            <PrimaryButton
                additionalClassName={"start-0 w-full"}
            >
                + New Chat
            </PrimaryButton>
        </div>
    )
}

export default HistoryContainer