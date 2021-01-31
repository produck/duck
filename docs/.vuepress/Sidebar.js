function GuideSidebar(guideTitle, advancedTitle) {
	return [
		{
			title: guideTitle,
			collapsable: false,
			children: [
				'',
        'getting-started',
				'directory-structure',
				'injection',
				'using-component',
				'web-application'
			]
		},
		{
			title: advancedTitle,
			collapsable: false,
			children: [
				'developing-a-component'
			]
		}
	]
}

module.exports = {
	GuideSidebar
};
