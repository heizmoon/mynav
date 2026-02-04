export interface LinkItem {
    id: string;
    name: string;
    url: string;
    icon?: string; // Base64 data URI
}

export interface CategoryData {
    id: string;
    title: string;
    items: LinkItem[];
}

export const DEFAULT_DATA: CategoryData[] = [
    {
        id: 'cat_ai',
        title: 'AI & Tools',
        items: [
            { id: 'ai_1', name: 'Gemini', url: 'https://gemini.google.com' },
            { id: 'ai_2', name: 'ChatGPT', url: 'https://chatgpt.com/' },
            { id: 'ai_3', name: 'Google Flow', url: 'https://labs.google/fx/zh/tools/flow' },
            { id: 'ai_4', name: 'Google Whisk', url: 'https://labs.google/fx/zh/tools/whisk' },
            { id: 'ai_5', name: 'Jimeng AI', url: 'https://jimeng.jianying.com/ai-tool/generate' }
        ]
    },
    {
        id: 'cat_dev',
        title: 'Dev & Code',
        items: [
            { id: 'dev_1', name: 'GitHub', url: 'https://github.com/' },
            { id: 'dev_2', name: 'Vercel Project', url: 'https://vercel.com/heizmoons-projects' },
            { id: 'dev_3', name: 'Hugging Face', url: 'https://huggingface.co/' },
            { id: 'dev_4', name: 'Claw Cloud', url: 'https://ap-northeast-1.run.claw.cloud/' }
        ]
    },
    {
        id: 'cat_gamedev',
        title: 'Game Dev',
        items: [
            { id: 'game_1', name: 'Itch.io', url: 'https://itch.io/' },
            { id: 'game_2', name: 'TapTap Dev', url: 'https://developer.taptap.cn/' },
            { id: 'game_3', name: '3839 Console', url: 'https://open.3839.com/console/' }
        ]
    },
    {
        id: 'cat_media',
        title: 'Media & Social',
        items: [
            { id: 'media_1', name: 'YouTube', url: 'https://www.youtube.com/' },
            { id: 'media_2', name: 'Bilibili', url: 'https://www.bilibili.com/' },
            { id: 'media_3', name: 'Discord', url: 'https://discord.com/app' }
        ]
    },
    {
        id: 'cat_mail',
        title: 'Mail',
        items: [
            { id: 'mail_1', name: 'Gmail', url: 'https://mail.google.com/' },
            { id: 'mail_2', name: '163 Mail', url: 'https://mail.163.com/' },
            { id: 'mail_3', name: 'QQ Mail', url: 'https://mail.qq.com/' }
        ]
    }
];
