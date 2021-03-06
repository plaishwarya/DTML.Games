import Phaser from 'phaser'
import english from '../language/language'

export default class Person extends Phaser.Sprite {
    constructor(game, x, y, config) {
        super(game, x, y, 'treebg', 0, config);
        this.game = game;
        this.selected = false;
        console.log(config);
        this.origConfig = config;
        this.setData(config);
        this.setConfig(config.key);
        if (config.relationToPlayer != english.you)
            this.line = new Phaser.Line(x, y, this.targetNode.x, this.targetNode.y);

        return this;
    }

    deletePerson(){
        this.destroy();
    }

    update() {
        if (this.line)
            this.line.fromSprite(this, this.targetNode, false);
    }

    selectNode() {
        console.log("Selecting Node");
        if(null != this.game.selectedNode)
            this.game.selectedNode.children[0].frame = 0;
        this.game.selectedNode = this;
        this.children[0].frame = 1;
    }

    setConfig(key) {
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setSize(this.width, this.height, 0, 0);
        this.sfxbtn = this.game.add.audio(this.type);
        this.bg = this.game.add.sprite(0, 0, 'sidebg');
        this.bg.anchor.set(0.5);

        this.scale.set(0.5);

        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.input.enableDrag(true);
        this.anchor.setTo(0.5);
        this.events.onInputDown.add(() => {
            this.selectNode();
        }, this);

        if (this.imageUsed) {
            this.character = this.game.add.sprite(0, 0, this.imageUsed, this.sex && this.relationToPlayer != english.you ? key + 11 : key);
            this.character.anchor.set(0.5);
        }

        var erasePos = 0;

        if (this.relation != 'me') {
            var erasePos = -30;

            this.eraseBtn = this.game.add.button(30, -85, 'erase', function () {
                this.activateErase();
                this.destroy();
            }.bind(this));
        }

        this.wordVoiceBtn = this.game.add.button(erasePos, -85, 'voice', function () {
            if (this.sfxbtn.key != '') this.sfxbtn.play();
        }.bind(this));
        this.wordVoiceBtn.scale.set(1.5);
        this.wordVoiceBtn.anchor.set(0.5);

        this.nameInput = this.createTextInput(-75, 60, this.getPlayerRelation());

        this.addChild(this.bg);
        this.addChild(this.wordVoiceBtn);
        this.addChild(this.nameInput);
        if (this.relation != 'me') {
            this.eraseBtn.scale.set(1.5);
            this.eraseBtn.anchor.set(0.5);
            this.addChild(this.eraseBtn);
        }

        if (this.imageUsed)
            this.addChild(this.character);

        // this.setTintRelation();
        this.game.add.existing(this);
        return this;
    }

    getPlayerRelation() {
        switch (this.relationToPlayer) {
            case 'GrandParent':
                return this.sex ? english.grandmother : english.grandfather;
            case 'Parent':
                return this.sex ? english.mother : english.father;
            case 'StepParent':
                return this.sex ? english.stepmother : english.stepfather;
            case 'Uncle/Aunt':
                return this.sex ? english.aunt : english.uncle;
            case 'Sibling':
                return this.sex ? english.sister : english.brother;
            case 'StepSibling':
                return this.sex ? english.stepsister : english.stepbrother;
            case 'Child':
                return this.sex ? english.daughter : english.son;
            case 'GrandChild':
                return this.sex ? english.grandDaughter : english.grandSon;
            case 'DistantRelative':
                return 'DistantRelative';
            default:
                return 'You';
        }
    }

    setData(cfg) {
        var relation;
        var relationToPlayer;
        if(null == cfg.btnText){
            cfg.targetNode = this.targetNode;
            cfg.btnText = this.origConfig.btnText;
        }

        switch (cfg.btnText) {
            case english.you:
                relation = english.you;
                relationToPlayer = english.you;
                break;
            case english.parents:
                relation = 'Parent';
                if (cfg.targetNode == this.game.you) {
                    relationToPlayer = 'Parent';
                } else {
                    switch (cfg.targetNode.relationToPlayer) {
                        case 'Parent':
                        case 'StepParent':
                            relationToPlayer = 'GrandParent';
                            break;
                        case 'Sibling':
                        case 'StepSibling':
                            relationToPlayer = 'Uncle/Aunt';
                            break;
                        case 'Child':
                            relationToPlayer = 'Sibling';
                            break;
                        default:
                            relationToPlayer = 'DistantRelative';
                            break;
                    }
                }
                break;
            case english.brothers:
                relation = 'Sibling';
                if (cfg.targetNode == this.game.you) {
                    relationToPlayer = 'Sibling';
                } else {
                    switch (cfg.targetNode.relationToPlayer) {
                        case 'Parent':
                        case 'StepParent':
                            relationToPlayer = 'Uncle/Aunt';
                            break;
                        case 'Sibling':
                            relationToPlayer = 'Sibling';
                            break;
                        case 'StepSibling':
                            relationToPlayer = 'StepSibling';
                            break;
                        case 'Child':
                            relationToPlayer = 'Niece/Nephew';
                            break;
                        default:
                            relationToPlayer = 'DistantRelative';
                            break;
                    }
                }
                break;
            case english.stepparents:
                relation = 'StepParent';
                if (cfg.targetNode == this.game.you) {
                    relationToPlayer = 'StepParent';
                } else {
                    switch (cfg.targetNode.relationToPlayer) {
                        case 'Parent':
                        case 'StepParent':
                            relationToPlayer = 'GrandParent';
                            break;
                        case 'Sibling':
                        case 'StepSibling':
                            relationToPlayer = 'Uncle/Aunt';
                            break;
                        case 'Child':
                            relationToPlayer = 'StepSibling';
                            break;
                        default:
                            relationToPlayer = 'DistantRelative';
                            break;
                    }
                }
                break;
            case english.stepbrothers:
                relation = 'StepSibling';
                if (cfg.targetNode == this.game.you) {
                    relationToPlayer = 'StepSibling';
                } else {
                    switch (cfg.targetNode.relationToPlayer) {
                        case 'Parent':
                        case 'StepParent':
                            relationToPlayer = 'Uncle/Aunt';
                            break;
                        case 'Sibling':
                            relationToPlayer = 'StepSibling';
                        case 'StepSibling':
                            relationToPlayer = 'Sibling';
                            break;
                        case 'Uncle/Aunt':
                            relationToPlayer = 'Uncle/Aunt';
                            break;
                        case 'Child':
                            relationToPlayer = 'Niece/Nephew';
                            break;
                        default:
                            relationToPlayer = 'DistantRelative';
                            break;
                    }
                }
                break;
            case english.children:
                relation = 'Child';
                if (cfg.targetNode == this.game.you) {
                    relationToPlayer = 'Child';
                } else {
                    switch (cfg.targetNode.relationToPlayer) {
                        case 'GrandParent':
                            relationToPlayer = 'Uncle/Aunt';
                            break;
                        case 'Parent':
                            relationToPlayer = 'Sibling';
                            break;
                        case 'StepParent':
                            relationToPlayer = 'StepSibling';
                            break;
                        case 'Uncle/Aunt':
                            relationToPlayer = 'Cousin';
                            break;
                        case 'Sibling':
                        case 'StepSibling':
                            relationToPlayer = 'Niece/Nephew';
                            break;
                        case 'Child':
                            relationToPlayer = 'GrandChild';
                            break;
                        default:
                            relationToPlayer = 'DistantRelative';
                            break;
                    }
                }
                break;
            default:
                console.log('Failed to add Relative.');
                break;
        }
        if (null != cfg.targetNode)
            console.log('Target: ' + cfg.targetNode.relationToPlayer);
        console.log('BtnText: ' + cfg.btnText);
        console.log('Relation: ' + relation);
        console.log('RelationToPlayer: ' + relationToPlayer);
        console.log('Gender:' + cfg.sex);

        this.imageUsed = cfg.image;
        this.key = cfg.key;
        this.sex = cfg.sex;
        this.targetNode = cfg.targetNode;
        this.relation = relation;
        this.relationToPlayer = relationToPlayer;
    }

    createTextInput(x, y, text) {
        var bmd = this.game.add.bitmapData(178, 35);
        var myInput = this.game.add.sprite(x, y, bmd);
        myInput.canvasInput = new CanvasInput({
            canvas: bmd.canvas,
            fontSize: 15,
            fontWeight: 'bold',
            width: this.bg.width + 20,
            maxlength: 20,
            borderColor: '#000',
            borderWidth: 1,
            placeHolderColor: '#000',
            placeHolder: '' + text,
            padding: 10
        });
        myInput.inputEnabled = true;
        myInput.events.onInputUp.add(this.inputFocus, this);
        return myInput;
    }

    inputFocus(sprite) {
        sprite.canvasInput.focus();
    }

    activateErase() {
        this.eraseSignal.dispatch();
    }

    setImageBg(cfg) {
        this.setData(cfg);

        if (this.character)
            this.character.destroy();

        console.log("RelationToPlayer: "+ this.relationToPlayer);
        this.nameInput.canvasInput._placeHolder = this.relationToPlayer.toUpperCase();
        this.inputFocus(this.nameInput);

        this.character = this.game.add.sprite(0, 0, this.imageUsed, this.key);
        this.character.anchor.set(0.5);
        this.addChild(this.character);

        this.sfxbtn.destroy();
        this.sfxbtn = this.game.add.audio(this.type);
    }
}