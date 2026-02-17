import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
} from 'src/constants/articleProps';
import type { OptionType } from 'src/constants/articleProps';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import styles from './ArticleParamsForm.module.scss';
import { useCloseOnOutsideClickOrEsc } from 'src/hooks/useCloseOnOutsideClickOrEsc';
import { ArticleState } from 'src/components/article-params-form/types';

interface ArticleParamsFormProps {
	isOpen: boolean;
	onToggle: () => void;
	currentState: ArticleState;
	onApply: (newState: ArticleState) => void;
	onReset: () => void;
}

export const ArticleParamsForm: React.FC<ArticleParamsFormProps> = ({
	isOpen,
	onToggle,
	currentState,
	onApply,
	onReset,
}) => {
	const formRef = useRef<HTMLDivElement>(null);

	const [formState, setFormState] = useState<ArticleState>(currentState);
	const [isClosing, setIsClosing] = useState(false);

	// Синхронизируем formState с currentState при открытии формы
	useEffect(() => {
		if (isOpen) {
			setFormState(currentState);
		}
	}, [isOpen, currentState]);

	// Клик вне формы
	useCloseOnOutsideClickOrEsc({
		isOpenElement: isOpen,
		elementRef: formRef,
		onClose: onToggle,
	});

	const toggleForm = () => {
		if (isOpen) {
			setIsClosing(true);
			setTimeout(() => {
				onToggle();
				setIsClosing(false);
			}, 800);
		} else {
			onToggle();
		}
	};

	const handleFieldChange =
		(field: keyof ArticleState) => (value: OptionType) => {
			setFormState((prev: ArticleState) => ({
				...prev,
				[field]: value,
			}));
		};

	const handleApply = () => {
		onApply(formState);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		onReset();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleApply();
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={toggleForm} />
			{(isOpen || isClosing) && (
				<aside
					ref={formRef}
					className={clsx(styles.container, {
						[styles.container_open]: isOpen && !isClosing,
						[styles.container_closing]: isClosing,
					})}>
					<form className={styles.form} onSubmit={handleSubmit}>
						<div className={styles.header}>
							<Text size={31} weight={800} uppercase>
								ЗАДАЙТЕ ПАРАМЕТРЫ
							</Text>
						</div>
						{/* 1. шрифт */}
						<div className={styles.formSection}>
							<Select
								selected={formState.fontFamilyOption}
								options={fontFamilyOptions}
								onChange={handleFieldChange('fontFamilyOption')}
								title='Шрифт'
							/>
						</div>
						{/* 2. размер текста*/}
						<div className={styles.formSection}>
							<RadioGroup
								name='font-size'
								selected={formState.fontSizeOption}
								options={fontSizeOptions}
								onChange={handleFieldChange('fontSizeOption')}
								title='Размер шрифта'
							/>
						</div>
						{/* 3. цвет текста */}
						<div className={styles.formSection}>
							<Select
								selected={formState.fontColor}
								options={fontColors}
								onChange={handleFieldChange('fontColor')}
								title='Цвет шрифта'
							/>
						</div>
						<div className={styles.separatorWrapper}>
							<Separator />
						</div>
						{/* 4. фон */}
						<div className={styles.formSection}>
							<Select
								selected={formState.backgroundColor}
								options={backgroundColors}
								onChange={handleFieldChange('backgroundColor')}
								title='Цвет фона'
							/>
						</div>
						{/* 5. ширина */}
						<div className={styles.formSection}>
							<Select
								selected={formState.contentWidth}
								options={contentWidthArr}
								onChange={handleFieldChange('contentWidth')}
								title='Ширина контента'
							/>
						</div>
						<div className={styles.bottomContainer}>
							<Button
								title='Сбросить'
								htmlType='button'
								type='clear'
								onClick={handleReset}
							/>
							<Button title='Применить' htmlType='submit' type='apply' />
						</div>
					</form>
				</aside>
			)}
		</>
	);
};
