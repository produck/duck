const Sidebar = require('./Sidebar');

module.exports = {
	locales: {
		'/': {
			lang: 'en-US',
			title: 'Duck',
			description: 'Or-change Duck Application Dev Framework'
		},
		'/langs/zh/': {
			lang: 'zh-CN',
			title: 'Duck',
			description: 'Or-change Duck 应用研发框架'
		}
	},
  theme: '@vuepress/vue',
  themeConfig: {
		smoothScroll: true,
		locales: {
			'/': {
				lang: 'en-US',
				title: 'Duck',
				label: 'English',
				description: 'Or-change Duck Application Dev Framework',
				nav: [
					{ text: 'Guide', link: '/guide/' },
					{ text: 'External', link: 'https://google.com' }
				],
				sidebar: {
					'/guide/': Sidebar.GuideSidebar('Guide', 'Advanced')
				}
			},
			'/langs/zh/': {
				lang: 'zh-CN',
				title: 'Duck',
				label: '简体中文',
				description: 'Or-change Duck 应用研发框架',
        selectText: '选择语言',
        ariaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
				nav: [
					{ text: '指南', link: '/langs/zh/guide/' },
					{ text: '外链', link: 'https://google.com' }
				],
				sidebar: {
					'/guide/': Sidebar.GuideSidebar('指南', '深入')
				}
			}
		},
	},
	plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/pwa', { serviceWorker: true, updatePopup: true }],
    ['@vuepress/medium-zoom', true],
	],
	extraWatchFiles: [
		'./Sidebar.js'
	]
};