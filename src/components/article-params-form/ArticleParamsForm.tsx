import { useState, useRef, useLayoutEffect } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	type ArticleStateType,
} from 'src/constants/articleProps';
import type { ArticleParamsFormProps } from './types';

import styles from './ArticleParamsForm.module.scss';

export const ArticleParamsForm = ({
	articleState,
	updateArticleState,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState<ArticleStateType>(articleState);
	const formRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (isOpen) {
			// Фокус на форму при открытии для улучшения доступности
			formRef.current?.focus();
		}
	}, [isOpen]);

	const handleFieldChange = (field: keyof ArticleStateType, value: any) => {
		setFormState((prevState) => ({
			...prevState,
			[field]: value,
		}));
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Применение настроек к основному компоненту
		updateArticleState(formState);
		setIsOpen(false);
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (
			formRef.current &&
			!formRef.current.contains(e.target as Node) &&
			isOpen
		) {
			setIsOpen(false);
		}
	};

	useLayoutEffect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			<aside
				ref={formRef}
				className={`${styles.container} ${
					isOpen ? styles.container_open : ''
				}`}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<h2 className={styles.title}>ЗАДАЙТЕ ПАРАМЕТРЫ</h2>

					<div className={styles.formSection}>
						<Select
							options={fontFamilyOptions}
							selected={formState.fontFamilyOption}
							placeholder='Выберите шрифт'
							title='Шрифт'
							onChange={(option) =>
								handleFieldChange('fontFamilyOption', option)
							}
						/>
					</div>

					<div className={styles.formSection}>
						<RadioGroup
							name='fontSize'
							options={fontSizeOptions}
							selected={formState.fontSizeOption}
							title='Размер шрифта'
							onChange={(option) => handleFieldChange('fontSizeOption', option)}
						/>
					</div>

					<div className={styles.formSection}>
						<Select
							options={fontColors}
							selected={formState.fontColor}
							placeholder='Выберите цвет текста'
							title='Цвет текста'
							onChange={(option) => handleFieldChange('fontColor', option)}
						/>
					</div>

					<div className={styles.formSection}>
						<Select
							options={backgroundColors}
							selected={formState.backgroundColor}
							placeholder='Выберите цвет фона'
							title='Цвет фона'
							onChange={(option) =>
								handleFieldChange('backgroundColor', option)
							}
						/>
					</div>

					<Separator />

					<div className={styles.formSection}>
						<RadioGroup
							name='contentWidth'
							options={contentWidthArr}
							selected={formState.contentWidth}
							title='Ширина контента'
							onChange={(option) => handleFieldChange('contentWidth', option)}
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
		</>
	);
};
