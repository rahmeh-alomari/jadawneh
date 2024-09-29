export interface Locale 
{
    prefix    : string,
    name      : string,
    direction : string,
}

export interface Topic
{
    type   : string,
    topic  : string,
    status : string
}

export interface User 
{
    user_id                           : number,
    name                              : string,
    email                             : string | null,
    registration_type                 : string,
    image                             : string,
    role                              : string,
    sex                               : string,
    birth_date                        : string,
    receive_notifications             : boolean,
    receive_program_notifications     : boolean,
    receive_broadcaster_notifications : boolean,
    nationality                       : string | null,
    topics                            : Topic[],
    token                            ?: string | null,
}

export interface Validation
{
    field   : string,
    message : string,
}

export interface Errors
{
    invalid_fields ?: Validation[]
}

export interface Response
{
    success : true,
    code    : string,
    message : string,
    hint    : string,
    result  : any    | null,
    errors ?: Errors | null,
}

export interface Home
{
    featured_programs : Program[],
    recently_listened : Episode[],
    we_chose_for_you  : Episode[],
    categories        : Category[],
    explore           : Program[],
    latest_episodes   : Episode[],
    most_listened     : Episode[],
    broadcasters      : Podcaster[],
}

export interface Category 
{
    category_id : number,
    title       : string,
    description : string | null,
    image       : string,
    programs   ?: Program[],
}

export interface Episode 
{
    episode_id           : number,
    title                : string,
    description          : string    | null,
    image                : string,
    duration             : string    | null,
    favored_by           : number,
    you_favored_this     : boolean,
    uploaded_at          : string,
    listened_by          : number,
    you_listened_to_this : boolean,
    paused_at            : string,
    link                 : string,
    program_id           : number    | null,
    program_title        : string    | null,
    program_image        : string    | null,
    broadcaster          : Podcaster | null,
    share                : string,
}

export interface Season 
{
    season_id : number,
    title     : string,
    selected ?: boolean
}

export interface Program 
{
    program_id       : number,
    title            : string,
    description      : string    | null,
    image            : string    | null,
    cover            : string    | null,
    wide_cover       : string    | null,
    favored_by       : number    | null,
    you_favored_this : boolean,
    episode_count    : number    | null,
    season_count     : number    | null,
    episodes         : Episode[],
    broadcaster      : Podcaster | null,
    seasons         ?: Season[],
    share            : string,
}

export interface Podcaster 
{
    broadcaster_id   : number,
    title            : string,
    description      : string | null,
    image            : string,
    you_favored_this : boolean,
    program_count    : number,
    programs         : Program[],
    share            : string
}

export interface Favorite 
{
    list           : Episode[] | Podcaster[] | Program[],
    page           : number,
    total          : number,
    has_more_pages : number,
}

export interface PaginatedList 
{
    list           : Episode[] | Podcaster[] | Program[],
    page           : number,
    total          : number,
    has_more_pages : number,
}

export interface SocialProfile
{
    social_id          : string,
    email 		       : string,
    name  		       : string,
    registration_type  : 'APPLE' | 'FACEBOOK' | 'GOOGLE',
}

export interface Page
{
    content_id               : number,
    title 		             : string,
    description              : string,
    description_without_tags : string,
    image                    : string,
}

export interface Config
{
    label       : number,
    placeholder : string,
    key         : string,
    value       : string,
}

export interface Footer
{
    categories   : Category[],
    explore      : Program[],
    broadcasters : Podcaster[],
}