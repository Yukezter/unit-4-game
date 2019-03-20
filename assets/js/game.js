$(document).ready(function() {
    (function(){
        // Global vars
    
        // Flags
        var characterPicked = false;
        var enemyPicked = false;
        var enemyIsDead = false;
        var gameOver = false;
        var animating = false;
    
        // Character variables
        var userCharacter = {};
        var enemies = [];
        var currentEnemy = {};
        var currentEnemyIndex = -1;
        
        // Character class
        var Character = function() {
            this.hp = 100;
            this.name = "";
            this.baseDamage = 0;
            this.attackDamage = 0;
            this.counterDamage = 0;
            this.element;
    
            this.attack = function(obj) {
                obj.hp -= this.attackDamage;
                this.attackDamage += this.baseDamage;
            }
            this.counterAttack = function(obj) {
                obj.hp -= this.counterDamage;
            }
            this.updateHTML = function() {
                $('.hp', this.element).text(this.hp);
                $('.attack-damage', this.element).text(this.attackDamage);
            }
        }
    
        $('#start-game-button').on('click', function() {
    
            if (!animating) {
                animating = true;
                $('.main-text').text('Star Wars RPG');
                $('.instructions').text('Pick a character!');
                $('#start-game-button').fadeOut('fast');
    
                $('.lego').each(function() {
                    $(this).find('.hp').text(100);
                    $(this).find('.attack-damage').text($(this).attr('base-damage'));
                    $(this).animate({
                        left: $(this).data('left'),
                        right: $(this).data('right'),
                    }, 2000, function() {
                        $(this).css({
                            'background-image': $(this).data('background-image'),
                        });
                        $(this).fadeIn('fast');
                    });
                });
    
                $('.lego').promise().done(function() {
                    // Flags
                    characterPicked = false;
                    enemyPicked = false;
                    enemyIsDead = false;
                    gameOver = false;
    
                    // Character variables
                    userCharacter = {};
                    enemies = [];
                    currentEnemy = {};
                    currentEnemyIndex = -1;
                    animating = false;
                });
            }
        });
    
        // Click a lego
        $('.lego').on('click', function() {
            if (!characterPicked && !gameOver && !animating) {
                characterPicked = true;
                animating = true;
    
                $('.instructions').text('Pick an enemy!');
                $('#start-game-button').fadeIn('fast');
                
                userCharacter = new Character();
                userCharacter.name = $(this).attr('name');
                userCharacter.baseDamage = parseInt($(this).attr('base-damage'))
                userCharacter.attackDamage = parseInt($(this).attr('base-damage'));
                userCharacter.counterDamage = parseInt($(this).attr('counter-damage'));
                userCharacter.element = $(this);
    
                $(this).data('left', $(this).css('left'));
                $(this).data('right', $(this).css('right'));
                $(this).data('background-image', $(this).css('background-image'));

                var onRightSide = $(this).data('right') == '20px' || $(this).data('right') == '240px';
    
                $(this).animate({
                    'left': '35%',
                }, 2000, function() {
                    if (onRightSide) {
                        var imgUrl = 'assets/img/lego-' + userCharacter.name + '2.png';
                        $(this).css({
                            'background-image': "url('" + imgUrl + "')",
                        });
                    }
                    $(this).siblings().each(function(index) {
                        enemies[index] = new Character();
                        enemies[index].name = $(this).attr('name');
                        enemies[index].baseDamage = parseInt($(this).attr('base-damage'));
                        enemies[index].attackDamage = parseInt($(this).attr('base-damage'));
                        enemies[index].counterDamage = parseInt($(this).attr('counter-damage'));
                        enemies[index].element = $(this);
                    });
                    animating = false;
                });
            } else if (characterPicked && !enemyPicked && !animating) {
                if ($(this).attr('name') !== userCharacter.name) {
                    animating = true;
                    enemyPicked = true;
                    enemyIsDead = false;
    
                    $('.main-text').text('May the force be with you!!!');
                    $('.instructions').text('Fight to the death!');
    
                    
                    currentEnemy = enemies.find((obj, index) => {
                    if (obj.name === $(this).attr('name')) {
                        currentEnemyIndex = index;
                        return obj;
                        }
                    });
    
                    $(this).data('left', $(this).css('left'));
                    $(this).data('right', $(this).css('right'));
                    $(this).data('background-image', $(this).css('background-image'));

                    var onLeftSide = $(this).data('left') == '20px' || $(this).data('left') == '240px';
    
                    $(this).animate({
                        'left': '50%',
                    }, 2000, function() {
                        if (onLeftSide) {
                            var imgUrl = 'assets/img/lego-' + currentEnemy.name + '2.png';
                            $(this).css({
                                'background-image': "url('" + imgUrl + "')",
                            });
                        }
                        animating = false;
                    });
                }
            }
        });
    
        $(this).keyup(function(e) {
            var isLetterA = e.which == 65 || e.which == 97;
            if (isLetterA && !gameOver && !animating) {
                if (enemyPicked && !enemyIsDead) {
                    userCharacter.attack(currentEnemy);
                    currentEnemy.counterAttack(userCharacter);
                    userCharacter.updateHTML();
                    currentEnemy.updateHTML();
                    if (currentEnemy.hp <= 0 && userCharacter.hp >= 0) {
                        enemyIsDead = true;
                        enemyPicked = false;
                        enemies.splice(currentEnemyIndex, 1);
                        currentEnemy.element.fadeOut('fast');
                        if (enemies.length === 0) {
                            gameOver = true;
                            $('.main-text').text('You survived!');
                            $('.instructions').text('Wowzers! Good job dude!');
                        } else {
                            $('.instructions').text('Pick next enemey!');
                        }
                    } else if (userCharacter.hp <= 0) {
                        gameOver = true;
                        userCharacter.element.fadeOut('fast');
                        $('.main-text').text('You lost!');
                        $('.instructions').text('Better luck next time...');
                    }
                }
            }
        });
    }())
});