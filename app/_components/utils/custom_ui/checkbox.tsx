export default function CheckboxButton({ handleClick, isChecked }: { handleClick: () => void, isChecked: boolean }) {
    return (
        <button
            className={`peer h-4 w-4 shrink-0 rounded-sm outline outline-[2px] 
                ${isChecked ? "bg-primaryFg text-primary-foreground outline-primary" 
                            : "outline-colorBg_cek4"}
                focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
            aria-pressed={isChecked}
            onClick={handleClick}
        >
            {isChecked ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-4 w-4 text-white"><path d="M20 6 9 17l-5-5"></path></svg> : ""}
            
        </button>
    );
}