import { Send } from "lucide-react";

import { ASSISTANT_CONFIG } from "./assistant.constants";

export default function ChatInput({
	value,
	onChange,
	onSubmit,
	loading,
}) {
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
			className="
				mt-4 flex items-center gap-2
				rounded-full border border-aira-primary/10
				bg-white p-1.5 pl-5 shadow-soft
				sm:pl-6
			"
		>
			<input
				type="text"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={ASSISTANT_CONFIG.placeholder}
				aria-label="Tulis pertanyaan Anda"
				disabled={loading}
				className="
					min-w-0 flex-1 bg-transparent py-3
					text-sm text-aira-text outline-none
					placeholder:text-aira-text/40
					disabled:opacity-60
				"
			/>

			<button
				type="submit"
				disabled={!value.trim() || loading}
				aria-label="Kirim pesan"
				className="
					grid size-11 shrink-0 place-items-center
					rounded-full bg-aira-primary text-white
					transition-colors hover:bg-aira-primary-dark
					disabled:cursor-not-allowed disabled:opacity-40
				"
			>
				<Send className="size-5" />
			</button>
		</form>
	);
}
