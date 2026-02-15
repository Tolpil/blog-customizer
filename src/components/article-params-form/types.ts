import type { ArticleStateType } from 'src/constants/articleProps';

export type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	updateArticleState: (newState: ArticleStateType) => void;
};
