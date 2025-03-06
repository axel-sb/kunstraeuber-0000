import { type Artwork } from '@prisma/client'
import { prisma } from '../../utils/db.server.ts'

enum ArtworkScalarFieldEnum {
	id = 'id',
	title = 'title',
	artist_display = 'artist_display',
	artist_title = 'artist_title',
	date_end = 'date_end',
	date_display = 'date_display',
	place_of_origin = 'place_of_origin',
	medium_display = 'medium_display',
	provenance_text = 'provenance_text',
	dimensions = 'dimensions',
	description = 'description',
	biography = 'biography',
	artwork_type_title = 'artwork_type_title',
	category_titles = 'category_titles',
	term_titles = 'term_titles',
	style_titles = 'style_titles',
	subject_titles = 'subject_titles',
	classification_titles = 'classification_titles',
	technique_titles = 'technique_titles',
	width = 'width',
	height = 'height',
	color_h = 'color_h',
	color_s = 'color_s',
	color_l = 'color_l',
	colorHsl = 'colorHsl',
	image_url = 'image_url',
	alt_text = 'alt_text',
	favorite = 'favorite',
	weight = 'weight',
	tags = 'tags',
}

/* const fields: ArtworkScalarFieldEnum[] = [
	ArtworkScalarFieldEnum.id,
	ArtworkScalarFieldEnum.title,
	ArtworkScalarFieldEnum.artist_display,
	ArtworkScalarFieldEnum.artist_title,
	ArtworkScalarFieldEnum.date_end,
	ArtworkScalarFieldEnum.date_display,
	ArtworkScalarFieldEnum.place_of_origin,
	ArtworkScalarFieldEnum.medium_display,
	ArtworkScalarFieldEnum.provenance_text,
	ArtworkScalarFieldEnum.dimensions,
	ArtworkScalarFieldEnum.description,
	ArtworkScalarFieldEnum.biography,
	ArtworkScalarFieldEnum.artwork_type_title,
	ArtworkScalarFieldEnum.category_titles,
	ArtworkScalarFieldEnum.term_titles,
	ArtworkScalarFieldEnum.style_titles,
	ArtworkScalarFieldEnum.subject_titles,
	ArtworkScalarFieldEnum.classification_titles,
	ArtworkScalarFieldEnum.technique_titles,
	ArtworkScalarFieldEnum.width,
	ArtworkScalarFieldEnum.height,
	ArtworkScalarFieldEnum.color_h,
	ArtworkScalarFieldEnum.color_s,
	ArtworkScalarFieldEnum.color_l,
	ArtworkScalarFieldEnum.colorHsl,
	ArtworkScalarFieldEnum.image_url,
	ArtworkScalarFieldEnum.alt_text,
	ArtworkScalarFieldEnum.favorite,
	ArtworkScalarFieldEnum.weight,
	ArtworkScalarFieldEnum.tags,
] */
//+  _______________________________ MARK:BY ID
export function getArtwork({ id }: Pick<Artwork, 'id'>) {
	return prisma.artwork.findFirst({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			style_titles: true,
			artwork_type_title: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			favorite: true,
			weight: true,
			colorHsl: true,
		},
		where: { id },
	})
}

//+  ______________________________________ MARK:URL BY ID
export function getArtworkUrl({ id }: Pick<Artwork, 'id'>) {
	return prisma.artwork.findFirst({
		select: {
			image_url: true,
			colorHsl: true,
		},
		where: { id: Number(id) }, // Ensure id is converted to a number if expected by the database
	})
}

//+   __________________________________ MARK: BY FAVORITE
export function getFavorite() {
	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { favorite: { equals: true } },
		skip: 0,
		take: 500,
	})
}

// UPDATE FAVORITE
export async function updateArtwork(id: Artwork['id']) {
	const artwork = await prisma.artwork.findUnique({
		where: { id },
		select: {
			favorite: true,
			colorHsl: true,
		},
	})

	if (!artwork) {
		throw new Error('Artwork not found')
	}

	const updatedFavorite = !artwork.favorite

	const update = prisma.artwork.update({
		where: { id },
		data: { favorite: updatedFavorite },
	})

	return update
}

//+  ___________________________________________ MARK: BY ANY
export function getAny(
	q: string,
	searchType: string,
	limit: number,
	page: number,
) {
	if (!q || q.trim() === '') {
		// If the q is empty, return an empty array or handle accordingly
		return []
	}

	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// const start = (pageNumber - 1) * limitNumber
	console.log('🟡 ALL (getAny):pageNumber', pageNumber)

	console.log('🟡 search params ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			provenance_text: true,
			dimensions: true,
			description: true,
			biography: true,
			category_titles: true,
			term_titles: true,
			style_titles: true,
			artwork_type_title: true,
			subject_titles: true,
			classification_titles: true,
			technique_titles: true,
			width: true,
			height: true,
			color_h: true,
			color_s: true,
			color_l: true,
			colorHsl: true,
			image_url: true,
			alt_text: true,
			favorite: true,
			weight: true,
			tags: true,
		},
		where: {
			OR: [
				// { id: { equals: parseInt(q) } },
				{ title: { contains: q } },
				{ artist_title: { contains: q } },
				{ term_titles: { contains: q } },
				{ subject_titles: { contains: q } },
				{ classification_titles: { contains: q } },
				{ category_titles: { contains: q } },
				{ style_titles: { contains: q } },
				{ technique_titles: { contains: q } },
				{ alt_text: { contains: q } },
				{ description: { contains: q } },
				{ place_of_origin: { contains: q } },
				{ medium_display: { contains: q } },
				{ artist_title: { contains: q } },
				{ date_end: { equals: parseInt(q) } },
				{ date_display: { contains: q } },
			],
			/* AND: [
				{ description: { not: 'null' } },
				{ description: { not: '' } },
				{ description: { not: null } },
			], */
		},
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  _______________SUGGESTED ANY

export function getSuggestedAny(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

    // const start = (pageNumber - 1 ) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})
	if (!q) {
		q = 'q cannot be null'
	}
	console.log('getSuggestedAny q:', q)

	return prisma.artwork.findMany({
		distinct: [
			'artist_title',
			'title',
			'term_titles',
			'subject_titles',
			'classification_titles',
			'category_titles',
			'style_titles',
			'technique_titles',
			'description',
			'place_of_origin',
			'medium_display',
			'date_end',
		],
		// orderBy: { artist_title: 'asc' },
		select: {
			artist_title: true,
			title: true,
			term_titles: true,
			subject_titles: true,
			classification_titles: true,
			category_titles: true,
			style_titles: true,
			technique_titles: true,
			description: true,
			place_of_origin: true,
			medium_display: true,
			date_end: true,
			artist_display: true,
		},
		where: {
			OR: [
				{ title: { contains: q } },
				{ artist_title: { contains: q } },
				{ term_titles: { contains: q } },
				{ subject_titles: { contains: q } },
				{ classification_titles: { contains: q } },
				{ category_titles: { contains: q } },
				{ style_titles: { contains: q } },
				{ technique_titles: { contains: q } },
				{ alt_text: { contains: q } },
				{ description: { contains: q } },
				{ place_of_origin: { contains: q } },
				{ medium_display: { contains: q } },
				{ artist_title: { contains: q } },
			],
		},
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  _________________________________________ MARK:BY ARTIST
export async function getArtist(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	if (!q || q.trim() === '') {
		return []
	}

	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// // // // // const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	const count = prisma.artwork.count({
		where: { artist_title: { contains: q } },
	})
	console.log('📋 ⑴⑵⑶ Count', count)

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { artist_title: { contains: q } },
		orderBy: { weight: 'desc' },
		take: limitNumber,
	})
}

// #region temp
// #endregion

//+  ____________SUGGESTED ARTISTS

export function getSuggestedArtists(q?: string | '') {
	if (!q) {
		q = 'q cannot be null'
	}
	console.log('q:', q)

	return prisma.artwork.findMany({
		distinct: ['artist_title'],
		// orderBy: { artist_title: 'asc' },
		select: {
			artist_title: true,
			// artist_display: true,
		},
		where: { artist_title: { contains: q } },
		/* OR: [
				{ artist_title: { contains: q } },
				{ artist_display: { contains: q } },
			], */
		orderBy: { artist_title: 'asc' },
		skip: 0,
		take: 20,
	})
}

// GROUP SUGGESTED ARTISTS

export function getGroupedSuggestedArtists(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.groupBy({
		by: ['artist_title'],
		_count: { artist_title: true },
		where: { artist_title: { contains: q } },
		// order alphabetically
		orderBy: { artist_title: 'asc' },
		skip: 0,
		take: 20,
	})
}

//+ ________________________________________ MARK: BY SUBJECT
export function getSubject(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// // // // // const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { subject_titles: { contains: q } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ___________SUGGESTED SUBJECTS

export function getSuggestedSubjects(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { subject_titles: { contains: q } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ________________________________________ MARK: BY STYLE
export function getStyle(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { style_titles: { contains: q } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ____________SUGGESTED STYLES

export function getSuggestedStyles(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}
	console.log('q:', q)

	return prisma.artwork.findMany({
		distinct: ['style_titles'],
		select: {
			style_titles: true,
		},
		where: {
			style_titles: { contains: q },
		},
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ____________________________________ MARK: BY TECHNIQUE
export function getTechnique(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	if (!q || q.trim() === '') {
		return []
	}

	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// // // // // const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { technique_titles: { contains: q } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  _________SUGGESTED TECHNIQUE

export function getSuggestedTechniques(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			tags: true,
		},
		where: {
			technique_titles: { contains: q },
		},
		orderBy: { tags: 'asc' },
		skip: 0,
		take: 20,
	})
}

//+  ____________________________________ MARK: BY MEDIUM
export function getMedium(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	if (!q || q.trim() === '') {
		return []
	}

	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// // // // // const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { medium_display: { contains: q } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ___________ SUGGESTED MEDIUM

export function getSuggestedMedium(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			tags: true,
		},
		where: {
			medium_display: { contains: q },
		},
		orderBy: { tags: 'asc' },
		skip: 0,
		take: 20,
	})
}

//+  _________________________________________ MARK: BY TYPE
export function getType(
	q: string,
	searchType: string,
	limit: number = 5,
	page: number,
) {
	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// // // // // const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { artwork_type_title: { contains: q } },
		orderBy: { artwork_type_title: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ______________SUGGESTED TYPES

export function getSuggestedTypes(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		distinct: ['artwork_type_title'],
		select: {
			artwork_type_title: true,
		},
		where: {
			artwork_type_title: { contains: q },
		},
		orderBy: { artwork_type_title: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ___________________________________________ MARK: BY TAG

export function getTags(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// // // // // const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { tags: { contains: q } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  _______________SUGGESTED TAGS

export function getSuggestedTags(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			tags: true,
		},
		where: {
			tags: { contains: q },
		},
		orderBy: { tags: 'asc' },
		skip: 0,
		take: 20,
	})
}

//+  _________________________________________ MARK: BY TERM

export function getTerm(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// // // // // const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { term_titles: { contains: q } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  _________________________________________ MARK: BY PLACE
export function getPlace(
	q: string,
	searchType: string,
	limit: number = 20,
	page: number,
) {
	// Parse limit and page to ensure they are numbers
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	if (isNaN(limitNumber) || isNaN(pageNumber)) {
		throw new Error('Invalid limit or page number')
	}

	// // // // // const start = (pageNumber - 1) * limitNumber

	console.log('🟡 search params: ', {
		q,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	})

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		orderBy: { weight: 'desc' },
		where: { place_of_origin: { contains: q } },

		skip: 0,
		take: 20,
	})
}

//+  _____________SUGGESTED PLACES

export function getSuggestedPlaces(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			place_of_origin: true,
		},
		where: {
			place_of_origin: { contains: q },
		},
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  _______________________________________ MARK: BY DATE
export function getDate(
	qDate: number = 0,
	// searchType: string,
	// limit: number = 20,
	// page: number,
) {
	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: { date_end: { equals: qDate } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  _____________SUGGESTED DATES

export function getSuggestedDates(q?: number | '') {
	if (!q) {
		q = 0
	}

	return prisma.artwork.findMany({
		select: {
			date_end: true,
		},
		where: {
			date_end: { equals: q },
		},
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  _________________________________________ MARK: BY COLOR
export function getColor(
	q: number | 0,
	// searchType: string,
	// limit: number = 20,
	// page: number,
) {
	// Parse limit and page to ensure they are numbers
	/* const qNumber = Number(q)
	const limitNumber = Number(limit)
	const pageNumber = Number(page)

	const start = (pageNumber - 1) * limitNumber

	console.log('🟡 [getColor] search params: ', {
		q,
		qNumber,
		searchType,
		limit,
		limitNumber,
		page,
		pageNumber,
	}) */
	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_title: true,
			artist_display: true,
			date_end: true,
			date_display: true,
			place_of_origin: true,
			medium_display: true,
			technique_titles: true,
			description: true,
			width: true,
			height: true,
			image_url: true,
			term_titles: true,
			subject_titles: true,
			category_titles: true,
			classification_titles: true,
			provenance_text: true,
			alt_text: true,
			color_h: true,
			color_s: true,
			color_l: true,
			artwork_type_title: true,
			favorite: true,
			weight: true,
			colorHsl: true,
			style_titles: true,
			tags: true,
			biography: true,
			dimensions: true,
		},
		where: {
			color_h: {
				gt: q - 2,
				lt: q + 2,
			},
			color_s: { gt: Number(25) },
			color_l: { gt: Number(15), lt: Number(85) },
		},
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//__ _______________________________ MARK: Search Suggestions

export async function searchSuggestions(
	q: string | number,
	searchType: string,
) {
	console.log(
		'🔎 [search-data-server log] searchSuggestions params (q, searchType:):',
		{
			q,
			searchType,
		},
	)
	if (!q) {
		throw new Error('q cannot be null')
	}

	let whereClause = {}
	let selectClause = {}

	switch (searchType) {
		case 'all':
			whereClause = {
				OR: [
					// { id: { equals: Number(q) } },
					{ title: { contains: q } },
					{ artist_title: { contains: q } },
					{ term_titles: { contains: q } },
					{ subject_titles: { contains: q } },
					{ classification_titles: { contains: q } },
					{ category_titles: { contains: q } },
					{ style_titles: { contains: q } },
					{ technique_titles: { contains: q } },
					{ alt_text: { contains: q } },
					{ description: { contains: q } },
					{ place_of_origin: { contains: q } },
					{ medium_display: { contains: q } },
					{ artist_title: { contains: q } },
					// { date_end: { equals: Number(q) } },
					{ date_display: { contains: q } },
				],
			}
			whereClause = { style_titles: { contains: q } }
			selectClause = { style_titles: true }
			break
			break
		case 'style':
			whereClause = { style_titles: { contains: q } }
			selectClause = { style_titles: true }
			break
		case 'subject':
			whereClause = { subject_titles: { contains: q } }
			selectClause = { subject_titles: true }
			break
		case 'tags':
			whereClause = { tags: { contains: q } }
			selectClause = { tags: true }
			break
		case 'term':
			whereClause = { term_titles: { contains: q } }
			selectClause = { term_titles: true }
			break
		case 'technique':
			whereClause = { technique_titles: { contains: q } }
			selectClause = { technique_titles: true }
			break
		case 'type':
			whereClause = { artwork_type_title: { contains: q } }
			selectClause = { artwork_type_title: true }
			break
		case 'medium':
			whereClause = { medium_display: { contains: q } }
			selectClause = { medium_display: true }
			break
		case 'place':
			whereClause = { place_of_origin: { contains: q } }
			selectClause = { place_of_origin: true }
			break
		case 'date':
			whereClause = { date_end: { equals: Number(q) } }
			selectClause = { date_end: true }
			break
		case 'color':
			whereClause = { color_h: { equals: Number(q) } }
			selectClause = { color_h: true }
			break
		default:
			whereClause = { artist_title: { contains: q } }
			selectClause = { artist_title: true }
	}

	return prisma.artwork.findMany({
		distinct: Object.keys(selectClause).map(
			(key) => key as unknown as ArtworkScalarFieldEnum,
		),
		select: selectClause,
		where: whereClause,
		// orderBy: { artist_title: 'asc' },
		skip: 0,
		take: 10,
	})
}

//__ MARK: Search Artworks

export async function searchArtworks(
	q: string,
	searchType: string,
	limit: number,
	pageNumber: number,
): Promise<Artwork[]> {
	console.log(
		'[searchArtworks] params (q, searchType, limit, page):',
		q,
		searchType,
		limit,
		pageNumber,
	)

	let result: Artwork[] = []
	switch (searchType) {
		case 'all':
			result = (await getAny(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'artist':
			result = (await getArtist(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'style':
			result = (await getStyle(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'subject':
			result = (await getSubject(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'tags':
			result = (await getTags(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'technique':
			result = (await getTechnique(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'type':
			result = (await getType(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'medium':
			result = (await getMedium(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'place':
			result = (await getPlace(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'date':
			result = (await getDate(Number(q), )).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'color':
			result = (await getColor(Number(q))).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		case 'term':
			result = (await getTerm(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
			break
		default:
			result = (await getAny(q, searchType, limit, pageNumber)).map(
				(artwork) => ({
					...artwork,
					latitude: null,
					longitude: null,
				}),
			)
	}

	return result
}
