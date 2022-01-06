import React, {Component} from 'react';
import game from "../../scripts/game";
import ReadOnlyEditor from "../../components/ReadOnlyEditor";

interface ComponentProps {
}

interface ComponentState {
}

export default class Content extends Component<ComponentProps, ComponentState> {
    render() {
        return <div className={"Content"}>
            <h2>Goal</h2>
            <p><strong>Program your own battle tank and destroy all other players.</strong></p>

            <p>You, the player, get access to all available resources using the JavaScript code you will have to write.
                This code will be uploaded to your tank and will be the main code for the tank. Without this code the
                tank is useless! </p>

            <p>Generally, the first obstacle is to write movement controls. If the difficulty level requires so, you
                might want to render a map/radar/board first. After that, you will need to implement other controls such
                as the shooting mechanism. Finally, you can upgrade everything: the thanks movement, the whole GUI,
                maybe even add AI?</p>

            <p>Can you program a tank faster/better than the other players?</p>

            <h3>Tank</h3>
            <p>The initial state of the tank does nothing. It's up to you to write the code for the tank. A basic
                example may already be given. If so, just click "Run" to upload the code to the tank and see what
                happens! The code for the tank should contain everything you want. For example, if you want your tank to
                be able to move, you can write code which does so. You are free to use the browsers JavaScript API to
                add key listeners or anything you think you will need. </p>

            <p>The code you write will be run in the browsers JavaScript thread. The same thread as were the game and
                graphics logics are run. So you will have access to these objects. Note that cheating is prevented by
                using a remote backend to hold the actual game state and do all the important calculations. </p>

            <h4>Interface</h4>
            <p>Your tank code must contain a class called <code>Tank</code>. Yes, you may create other classes as well
                as long as there is the main <code>Tank</code> class. This class must be an implementation of the
                following TypeScript interface:</p>

            <ReadOnlyEditor
                value={"interface TankInterface {\n" +
                "    constructor: (game: Game, previousTank?: TankProps) => void\n" +
                "\n" +
                "    // User provided\n" +
                "    appliedForce?: number\n" +
                "    rotation?: number\n" +
                "\n" +
                "    step?: (step: number) => void\n" +
                "    render?: () => void\n" +
                "\n" +
                "    // Server provided\n" +
                "    x?: number\n" +
                "    y?: number\n" +
                "    size?: number\n" +
                "    orientation?: number\n" +
                "}"}
            />

            <h5>constructor</h5>
            <p>Everytime you upload your code, a new <code>Tank</code> class will be created. During this creation,
                the <code>game</code> and <code>previousTank</code> properties will be passed to the constructor.
                The <code>previousTank</code> basically holds the current <code>Tank</code> object. As a whole new
                object is created and the current <code>Tank</code> object will be replaced with this new object, it is
                up to you to make sure all your precious values are preserved by copying these from
                the <code>previousTank</code> to the new tank. It is also good practice to declare all your class
                properties in the constructor. </p>

            <h5>appliedForce</h5>
            <p>By setting a (float) value to this property, the server will apply the set value to your tank. Remember,
                a value too small and the tank will experience too much friction to move. Too high and you tank will
                shoot uncontrollable over the field! </p>

            <h5>rotation</h5>
            <p>Use this value to rotate the tank. The value set will be added to the tank's orientation. This float
                value uses degrees instead of radians, so you may want to define
                a <code>degToRad()</code> and <code>radToDeg()</code> method.</p>

            <h5>Movement</h5>
            <p>These controls should result in an applied force on the tank. Using this applied force, the server will
                calculate the tank's position. When this is done, the tank's properties (x, y, ...) will be updated with
                the new information. </p>

            <h5>step</h5>
            <p>Everytime the game recalculates all tanks their states, a step is taken. This <code>step</code> method
                will be called on every game step. You may expect to have the latest game/state information stored in
                your tank's properties (x, y, ...). You use this <code>step</code> method to set new values
                to <code>appliedForce</code> and <code>rotation</code>, which will be send to the server after
                completion of the step. So basically, all control logic will be done in this <code>step</code> method.
            </p>

            <h5>render</h5>
            <p>To modify the GUI or create your own, you most probably need to render it. This can be done inside this
                method. The <code>render</code> method will be called during each graphics render cycle (most of the
                time this is done 60 times per second). This method isn't called at the same cycle as
                the <code>step</code> method, as you may want to render explosions or such which benefit from higher
                FPS.</p>

            <h5>x and y</h5>
            <p>These (and the next few) properties are set by the server and you may change them, but you will influence
                nothing. These values specify the position of your tank and are taken from the center of your tank. As
                you apply force on the tank, these values will likely change due to the acceleration of the tank induced
                by the applied force.</p>

            <h5>size</h5>
            <p>This constant specifies the diameter of your tank. Useful when drawing your tank on a canvas.</p>

            <h5>orientation</h5>
            <p>As you apply <code>rotation</code> to your tank, your orientation will change. This property defines the
                orientation of the tank. Note that this is not the same as the direction of travel of the tank. If you
                want to know this direction, you must code it's calculation yourself. </p>


            <h3>Game</h3>
            <p>The whole client side is controlled by the <code>Game</code> object. This object is passed to
                the <code>Tank</code> class through its constructor. It is up to you to save
                this <code>game</code> object for later use inside one of
                your <code>step</code> or <code>render</code> methods. It's not recommended to change any of
                the <code>game</code> object's properties. But for the interested, most properties are listed below.</p>

            <h4>Interface</h4>
            <p>The <code>Game</code> object implements the following interface:</p>

            <ReadOnlyEditor
                value={"interface GameInterface {\n" +
                "    configuration: GameConfiguration\n" +
                "    graphics: Graphics\n" +
                "    server: Server\n" +
                "\n" +
                "    stepCount: number\n" +
                "    playerIteration: number\n" +
                "    player: TankProps\n" +
                "\n" +
                "    setConfiguration: (configuration: GameConfiguration) => void\n" +
                "}"}
            />

            <h5>configuration</h5>
            <p>This property holds the game's configuration, as set by the server on initial connection.
                This <code>GameConfiguration</code> class is described by the following: </p>

            <ReadOnlyEditor value={"interface GameConfigurationInterface {\n" +
            "    mapWidth: number\n" +
            "    mapHeight: number\n" +
            "}"}/>

            <h5>graphics</h5>
            <p>The <object>Graphics</object> engine to use for rendering and handling all the client's graphics. See
                further on.
            </p>

            <h5>server</h5>
            <p>This <object>Server</object> object is used for the connection between the client and the server. It is
                highly discouraged to modify any of its properties. Of course we can't stop you from doing it, but only
                you will be affected by your mistakes ;) Note that if you modify this class, the server might disconnect
                you if it doesn't receive messages within a certain amount of time (on a scale of seconds).
            </p>

            <h5>stepCount</h5>
            <p>This counter is increased by one after every step taken. </p>

            <h5>playerIteration</h5>
            <p>This number is basically the versioning of your code. Each time you upload your code, this number will
                increase by one. It is not yet used for anything else. </p>

            <h5>player</h5>
            <p>This is you! A object will be instantiated from the code you upload. This object will be assigned to
                this <code>player</code> property. </p>

            <h5>setConfiguration</h5>
            <p>When the <code>Server</code> object receives a new configuration for the game, it will call this method
                with the new configuration. It will set the new configuration for the <code>Game</code> object and reset
                the <code>Graphics</code> object. </p>


            <h3>Graphics</h3>
            <p>You have access to the <code>Graphics</code> object, which handles all graphics. This object can be
                accessed through the <code>Game</code> object, like this: <code>game.graphics</code>. </p>

            <p>By default, a div with id <code>"{game.graphics.htmlElementId}"</code> is available to render graphics
                in. This is just an empty div, so you must add a canvas or whatever yourself. In easy difficulty,
                a <code>TopViewCamera</code> renderer is initialized which creates a canvas and projects each player on
                this canvas. </p>

            <p>The width and height of the game field can be found in the game's configuration, accessible
                through <code>game.configuration.mapWidth</code> and <code>game.configuration.mapHeight</code>. By
                default, the <code>Graphics</code> object initializes the <code>"{game.graphics.htmlElementId}"</code>-div
                with these dimensions. </p>

            <h4>Interface</h4>
            <p>The <code>Graphics</code> object implements the following interface:</p>

            <ReadOnlyEditor
                value={"interface GraphicsInterface {\n" +
                "    htmlElementId: string\n" +
                "    framesRendered: number\n" +
                "\n" +
                "    getHtmlElement(): HTMLElement | null\n" +
                "}"}
            />

            <h5>htmlElementId</h5>
            <p>The id of the div available. Currently, this id is <code>"{game.graphics.htmlElementId}"</code>.</p>

            <h5>framesRendered</h5>
            <p>An increasing counter of the rendered frames.</p>

            <h5>getHtmlElement</h5>
            <p>This method returns the available div for rendering graphics. If the div is not
                available, <code>null</code> will be returned. This div must have <code>htmlElementId</code> as id.</p>

            <h2>This website</h2>
            <p>This website - and basically the whole game - is still under development. </p>

            <h3>Editor</h3>
            <p>The editor on the right is the place where you can put in your new code for the tank. To prevent
                undesired key presses to be passed to your tank, the editor will catch all key presses as long as it has
                focus. Just click on the game board to regain focus on your tank. </p>

            <h5>Run / upload code</h5>
            <p>When you think your code is ready or you just want to test it, you can upload your code to the tank by
                pressing "Run". If your <code>Tank</code> class fails to initialize, the error will be displayed and the
                code won't be uploaded to the tank. When you've uploaded code which throws errors inside its other
                methods, like the <code>step</code> method, the errors won't be shown (yet) and your tank will probably
                do nothing. However, most errors are visible in your browsers console (Ctrl+Shift+I for most modern
                browsers). </p>

            <h5>auto-formatting</h5>
            <p>Ctrl-Shift-B for auto-formatting.</p>

            <p>If you're interested in all other functionality of the editor, check out the <a
                href={"https://ace.c9.io/"} target={"_blank"}>AceEditor</a> project. </p>
        </div>;
    }
}
