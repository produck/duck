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
  themeConfig: {
		locales: {
			'/': {
				lang: 'en-US',
				title: 'Duck',
				label: 'English',
				description: 'Or-change Duck Application Dev Framework',
				nav: [
					{ text: 'Home', link: '/' },
					{ text: 'Guide', link: '/guide/' },
					{ text: 'External', link: 'https://google.com' }
				],
			},
			'/langs/zh/': {
				lang: 'zh-CN',
				title: 'Duck',
				label: '简体中文',
				description: 'Or-change Duck 应用研发框架',
				nav: [
					{ text: '指南', link: '/langs/zh/guide/' },
					{ text: '外链', link: 'https://google.com' }
				],
			}
		},
  }
};