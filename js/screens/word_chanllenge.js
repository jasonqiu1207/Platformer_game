
/**
this tree structure is used to compare entered words against correct words in pre-saved array in JSON


**/

function Node(settings) {
	this.bg = settings.bg;
	this.word = settings.word
	this.sprites = settings.sprites || function() {return {}};
	this.right = settings.right;
	this.left = settings.left;
	this.callback = settings.callback;
}

Node.prototype.select = function(direction, state) {
	var choiceInfo = this[direction](state);
	choiceInfo.select();
	return choiceInfo.node;
};


function enterMode() {
	this.nodes = {};


	this.addNode('wrong_word', {
		
		left: function(state) {
			return {
				node: 'start',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
		

	}); //dead

	//start
	
	this.addNode('3_letter', {
		left: function(state) {
			return {
				node: 'startL',
				str: user.input();
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
		right: function(state) {
			return {
				node: 'startR',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
	}); //start
  
    this.nodes = {};


	this.addNode('3_letter_reverse', {
		

		left: function(state) {
			return {
				node: 'start',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
		

	}); //dead

	//start
	
	this.addNode('4_letter', {
		
		left: function(state) {
			return {
				node: 'startL',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
		right: function(state) {
			return {
				node: 'startR',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
	}); //start


    this.nodes = {};


	this.addNode('4_letter_reverse', {
		
		left: function(state) {
			return {
				node: 'start',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
		

	}); //dead

	//start
	
	this.addNode('5_letter', {
		left: function(state) {
			return {
				node: 'startL',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
		right: function(state) {
			return {
				node: 'startR',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
	}); //start


    this.nodes = {};


	this.addNode('5_letter_reverse', {
		

		left: function(state) {
			return {
				node: 'start',
				str: user.input(),
				select: function() {
					if str==iterateAllWords(str)
						return true;
				},
			};
		},
		

	}); //dead

	//start
	
	



})
