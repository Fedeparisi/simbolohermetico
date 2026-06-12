import React, { useEffect, useRef } from "react";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
          vec2 uv = v_texCoord;
          float time = u_time * 0.2;
          
          // Create a slow flowing organic noise pattern
          float noise = 0.0;
          vec2 p = uv * 2.0;
          for(float i = 1.0; i < 4.0; i++) {
              p.x += 0.3 / i * sin(i * p.y + time + i * 0.5);
              p.y += 0.3 / i * cos(i * p.x + time + i * 0.8);
              noise += 1.0 / i * sin(p.x * p.y);
          }
          
          // Base colors from the design system
          vec3 obsidian = vec3(0.04, 0.04, 0.04); // #0a0a0a
          vec3 gold = vec3(0.83, 0.69, 0.22);     // #d4af37
          vec3 violet = vec3(0.48, 0.38, 1.0);    // #7b61ff
          
          // Mix colors based on noise
          vec3 color = mix(obsidian, violet * 0.15, clamp(noise * 0.5 + 0.5, 0.0, 1.0));
          color = mix(color, gold * 0.05, clamp(sin(noise + time), 0.0, 1.0));
          
          // Add a soft vignette
          float vignette = 1.0 - length(uv - 0.5) * 1.2;
          color *= clamp(vignette, 0.5, 1.0);
          
          gl_FragColor = vec4(color, 1.0);
      }
    `;

    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    let animationFrameId: number;

    const resizeCanvas = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const observer = new ResizeObserver(() => resizeCanvas());
    observer.observe(canvas);
    resizeCanvas();

    function render(time: number) {
      gl!.clearColor(0.04, 0.04, 0.04, 1.0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      gl!.uniform1f(timeLocation, time * 0.001);
      gl!.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 opacity-40 pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
