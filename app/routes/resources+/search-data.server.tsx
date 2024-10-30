import { type Artwork } from '@prisma/client'
import chalk from 'chalk'
import { prisma } from '../../utils/db.server.ts'

//+  ___________              _____________________________  BY ID
export function getArtwork({ id }: Pick<Artwork, 'id'>) {
	return prisma.artwork.findFirst({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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

//+  ________________________________________________ URL BY ID
export function getArtworkUrl({ id }: Pick<Artwork, 'id'>) {
	return prisma.artwork.findFirst({
		select: {
			image_url: true,
			colorHsl: true,
		},
		where: { id: Number(id) }, // Ensure id is converted to a number if expected by the database
	})
}

//+   ____________________________________________  BY FAVORITE
export function getFavorite() {
	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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

//+  _____________________________________________________  BY ANY
export function getAny(qAny?: string | '') {
	if (!qAny) {
		qAny = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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
				{ title: { contains: qAny } },
				{ artist_display: { contains: qAny } },
				{ term_titles: { contains: qAny } },
				{ subject_titles: { contains: qAny } },
				{ classification_titles: { contains: qAny } },
				{ category_titles: { contains: qAny } },
				{ style_titles: { contains: qAny } },
				{ technique_titles: { contains: qAny } },
				// { provenance_text: { contains: qAny } },
				{ alt_text: { contains: qAny } },
				{ description: { contains: qAny } },
				{ place_of_origin: { contains: qAny } },
				{ medium_display: { contains: qAny } },
				{ artist_title: { contains: qAny } },
				{ date_end: { equals: parseInt(qAny) } },
				// { date_display:: { contains: qAny } },
			],
			AND: [{ description: { not: null } }],
		},
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  __________________________________________________  BY ARTIST
export function getArtist(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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
			OR: [
				{ artist_display: { contains: q } },
				{ artist_title: { contains: q } },
			],
		},
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+ __________________________________________________  BY SUBJECT
export function getArtworksBysubject_titles(querysubject_titles?: string | '') {
	if (!querysubject_titles) {
		querysubject_titles = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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
		where: { subject_titles: { contains: querysubject_titles } },
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ___________________________________________________  BY STYLE
export function getStyle(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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

//+  ____________________________________________________  BY TYPE
export function getType(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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
		orderBy: { weight: 'desc' },
		skip: 0,
		take: 20,
	})
}

//+  ___________________________________________________  BY PLACE
export function getPlace(qPlace?: string | '') {
	if (!qPlace) {
		qPlace = 'Query cannot be null'
	}

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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
		where: { place_of_origin: { contains: qPlace } },

		skip: 0,
		take: 20,
	})
}

//+  _________________________________________________  BY DATEEND
export function getDate(qDate?: number | 0) {
	if (!qDate) {
		qDate = 0
	}

	return prisma.artwork.findMany({
		select: {
			id: true,
			title: true,
			artist_display: true,
			artist_title: true,
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

// +  ________________________________________________   BY WEIGHT
export function getMinWeight(qWeight?: string | number) {
    // Convert to number and provide default value
    const weightValue = Number(qWeight) || 0

    console.log('🔍 Searching for weight >', weightValue, typeof(weightValue)) // Debug log

    return prisma.artwork.findMany({
			select: {
				id: true,
				title: true,
				artist_display: true,
				artist_title: true,
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
				weight: {
					gte: weightValue, // Changed from gt to gte for consistency
				},
			},
			orderBy: { weight: 'desc' },
			skip: 0,
			take: 20,
		})
}

//+  ___________________________________________________  BY COLOR
export function getColor(q?: string | '') {
	let numQ = Number(q)
	if (isNaN(numQ)) {
		console.log(chalk.red('🟡 numQ is not a number '))
	} else {
		return prisma.artwork.findMany({
			select: {
				id: true,
				title: true,
				artist_display: true,
				artist_title: true,
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
					gt: numQ - 2,
					lt: numQ + 2,
				},
				color_s: { gt: Number(15) },
				color_l: { gt: Number(15), lt: Number(85) },
			},
			orderBy: { weight: 'desc' },
			skip: 0,
			take: 20,
		})
	}
}

//+                                                UPDATE FAVORITE
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

//+                                                 COUNT BY GROUP
export function groupBy(q?: string | '') {
	if (!q) {
		q = 'Query cannot be null'
	}
	by: ['Artist', 'place_of_origin']
	return prisma.artwork.groupBy({
		where: { artist_display: { contains: q } },
		by: ['artist_display'],
		_count: {
			artist_display: true,
		},
		orderBy: {
			_count: {
				artist_display: 'desc',
			},
		},
	})
}



export async function searchArtworks(searchType: string, query: string): Promise<Artwork[]> {
    let data: Artwork[] | undefined
    switch (searchType) {
        case 'all':
            data = await getAny(query)
            break
        case 'artist':
            data = await getArtist(query)
            break
        case 'style':
            data = await getStyle(query)
            break
        case 'type':
            data = await getType(query)
            break
        case 'place':
            data = await getPlace(query)
            break
        case 'date':
            data = await getDate(Number(query))
            break
        case 'color':
            data = await getColor(query) ?? []
            break
        case 'weight':
            data = await getMinWeight(query)
            break
        default:
            data = await getAny(query)
    }
    return data ?? []
}

// Yes, this is a common TypeScript issue when working with Prisma - the selected fields need to match the expected return type. Let me know if you need any other help! (after having included all fields in each search query).