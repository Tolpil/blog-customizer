import { useEffect, RefObject } from 'react';

type UseClickOutsideProps = {
	isOpen: boolean;
	onChange: (newValue: boolean) => void;
	rootRef: RefObject<HTMLElement>;
};

export const useClickOutside = ({
	isOpen,
	onChange,
	rootRef,
}: UseClickOutsideProps) => {
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const { target } = event;
			if (target instanceof Node && !rootRef.current?.contains(target)) {
				onChange(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClick);
		}

		return () => {
			document.removeEventListener('mousedown', handleClick);
		};
	}, [isOpen, onChange, rootRef]);
};
