/*!
 * The sprites below are traced from the sprite sheet of Chromium's T-Rex
 * runner. The movement and hitbox numbers in this folder come from its
 * source code.
 *
 * Copyright 2014 The Chromium Authors
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *    * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *    * Neither the name of Google LLC nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Each path draws one sprite frame from its top-left corner, in game units
// (one unit is one pixel of the original sprite sheet).
export const spritePaths = {
  dinoStanding:
    "M24 2h16v2H24zm-2 2h20v1H22zm0 1h4v2h-4zm6 0h14v2H28zm-6 2h20v6H22zm0 6h10v2H22zm0 2h16v2H22zM2 17h2v4H2zm18 0h10v2H20zm-3 2h13v2H17zM2 21h4v2H2zm12 0h20v2H14zM2 23h6v2H2zm10 0h18v2H12zm20 0h2v2h-2zM2 25h28v4H2zm2 4h26v1H4zm0 1h24v1H4zm2 1h22v2H6zm2 2h18v2H8zm2 2h14v2H10zm2 2h6v2h-6zm8 0h4v2h-4zm-8 2h4v2h-4zm10 0h2v4h-2zm-10 2h2v2h-2zm0 2h4v2h-4zm10 0h4v2h-4z",
  dinoRunning1:
    "M24 2h16v2H24zm-2 2h20v1H22zm0 1h4v2h-4zm6 0h14v2H28zm-6 2h20v6H22zm0 6h10v2H22zm0 2h16v2H22zM2 17h2v4H2zm18 0h10v2H20zm-3 2h13v2H17zM2 21h4v2H2zm12 0h20v2H14zM2 23h6v2H2zm10 0h18v2H12zm20 0h2v2h-2zM2 25h28v4H2zm2 4h26v1H4zm0 1h24v1H4zm2 1h22v2H6zm2 2h18v2H8zm2 2h14v2H10zm2 2h6v2h-6zm10 0h5v2h-5zm-10 2h4v2h-4zm0 2h2v2h-2zm0 2h4v2h-4z",
  dinoRunning2:
    "M24 2h16v2H24zm-2 2h20v1H22zm0 1h4v2h-4zm6 0h14v2H28zm-6 2h20v6H22zm0 6h10v2H22zm0 2h16v2H22zM2 17h2v4H2zm18 0h10v2H20zm-3 2h13v2H17zM2 21h4v2H2zm12 0h20v2H14zM2 23h6v2H2zm10 0h18v2H12zm20 0h2v2h-2zM2 25h28v4H2zm2 4h26v1H4zm0 1h24v1H4zm2 1h22v2H6zm2 2h18v2H8zm2 2h14v2H10zm2 2h4v2h-4zm8 0h4v2h-4zm-6 2h4v2h-4zm8 0h2v4h-2zm0 4h4v2h-4z",
  dinoCrashed:
    "M24 2h16v2H24zm-2 2h20v1H22zm0 1h4v4h-4zm8 0h12v4H30zm-3 1h2v2h-2zm-5 3h20v6H22zm0 6h16v2H22zM2 17h2v4H2zm18 0h10v2H20zm-3 2h13v2H17zM2 21h4v2H2zm12 0h20v2H14zM2 23h6v2H2zm10 0h18v2H12zm20 0h2v2h-2zM2 25h28v4H2zm2 4h26v1H4zm0 1h24v1H4zm2 1h22v2H6zm2 2h18v2H8zm2 2h14v2H10zm2 2h6v2h-6zm8 0h4v2h-4zm-8 2h4v2h-4zm10 0h2v4h-2zm-10 2h2v2h-2zm0 2h4v2h-4zm10 0h4v2h-4z",
  dinoDucking1:
    "M2 19h2v2H2zm37 1h16v2H39zM2 21h6v2H2zm14 0h17v2H16zm21 1h20v1H37zM2 23h39v2H2zm41 0h14v2H43zM4 25h53v2H4zm2 2h51v2H6zm2 2h49v2H8zm2 2h37v2H10zm2 2h23v2H12zm27 0h14v2H39zm-25 2h21v1H14zm0 1h12v1H14zm17 0h2v2h-2zm-18 1h2v2h-2zm6 0h6v2h-6zm12 1h4v2h-4zm-18 1h4v2h-4zm6 0h4v2h-4zm0 2h2v2h-2zm0 2h4v2h-4z",
  dinoDucking2:
    "M2 19h2v2H2zm37 1h16v2H39zM2 21h6v2H2zm14 0h17v2H16zm21 1h20v1H37zM2 23h39v2H2zm41 0h14v2H43zM4 25h53v2H4zm2 2h51v2H6zm2 2h49v2H8zm2 2h37v2H10zm2 2h23v2H12zm27 0h14v2H39zm-25 2h21v1H14zm0 1h12v1H14zm17 0h2v2h-2zm-18 1h6v2h-6zm10 0h5v2h-5zm8 1h4v2h-4zm-18 1h4v2h-4zm0 2h2v2h-2zm0 2h4v2h-4z",
  pterodactyl1:
    "M10 8h4v2h-4zm-2 2h6v2H8zm-2 2h10v2H6zm-2 2h12v2H4zm-2 2h28v2H2zm12 2h18v2H14zm2 2h28v2H16zm2 2h20v2H18zm0 2h24v2H18zm0 2h18v2H18zm0 2h8v2h-8zm0 2h6v2h-6zm0 2h4v4h-4zm0 4h2v2h-2z",
  pterodactyl2:
    "M16 2h2v2h-2zm0 2h4v2h-4zm0 2h6v2h-6zm-6 2h4v2h-4zm8 0h6v2h-6zM8 10h6v2H8zm10 0h8v2h-8zM6 12h10v2H6zm12 0h10v2H18zM4 14h12v2H4zm14 0h12v2H18zM2 16h28v2H2zm12 2h18v2H14zm2 2h28v2H16zm2 2h20v2H18zm2 2h22v2H20zm2 2h14v2H22z",
  smallCactus1:
    "M7 1h3v1H7zM6 2h5v14H6zm8 3h1v1h-1zm-1 1h3v10h-3zM2 9h1v1H2zm-1 1h3v10H1zm5 6h10v1H6zm0 1h9v1H6zm0 1h8v1H6zm0 1h5v1H6zm-5 1h10v1H1zm1 1h9v1H2zm1 1h8v1H3zm3 1h5v11H6z",
  smallCactus2:
    "M7 1h3v1H7zm17 0h3v1h-3zM6 2h5v14H6zm17 0h5v11h-5zm-9 3h1v1h-1zm5 0h2v1h-2zm12 0h1v1h-1zM13 6h3v10h-3zm5 0h4v7h-4zm12 0h3v12h-3zM2 9h1v1H2zm-1 1h3v10H1zm17 3h10v2H18zm1 2h9v1h-9zM6 16h10v1H6zm14 0h8v1h-8zM6 17h9v1H6zm17 0h5v1h-5zM6 18h8v1H6zm17 0h10v1H23zM6 19h5v1H6zm17 0h9v1h-9zM1 20h10v1H1zm22 0h8v1h-8zM2 21h9v1H2zm21 0h5v13h-5zM3 22h8v1H3zm3 1h5v11H6z",
  smallCactus3:
    "M7 1h3v1H7zm17 0h3v1h-3zm17 0h3v1h-3zM6 2h5v14H6zm17 0h5v19h-5zm17 0h5v14h-5zM19 4h1v1h-1zm17 0h1v1h-1zM14 5h1v1h-1zm4 0h3v16h-3zm17 0h3v11h-3zm13 0h1v1h-1zM13 6h3v10h-3zm34 0h3v12h-3zM31 8h1v1h-1zM2 9h1v1H2zm28 0h3v14h-3zM1 10h3v10H1zm5 6h10v1H6zm29 0h10v1H35zM6 17h9v1H6zm30 0h9v1h-9zM6 18h8v1H6zm31 0h13v1H37zM6 19h5v1H6zm34 0h9v1h-9zM1 20h10v1H1zm39 0h8v1h-8zM2 21h9v1H2zm17 0h9v1h-9zm21 0h5v13h-5zM3 22h8v1H3zm17 0h8v1h-8zM6 23h5v11H6zm15 0h12v1H21zm2 1h9v1h-9zm0 1h8v1h-8zm0 1h5v8h-5z",
  largeCactus1:
    "M10 1h5v1h-5zM9 2h7v25H9zm11 9h3v1h-3zm-1 1h5v15h-5zM2 13h3v1H2zm-1 1h5v13H1zm0 13h22v1H1zm0 1h21v1H1zm1 1h19v1H2zm1 1h17v1H3zm1 1h12v1H4zm5 1h7v14H9zm10 13h1v1h-1zM5 46h1v1H5zm2 0h9v1H7zm9 2h1v1h-1z",
  largeCactus2:
    "M10 1h5v1h-5zm25 0h5v1h-5zM9 2h7v25H9zm25 0h7v19h-7zm-7 4h3v1h-3zm-1 1h5v14h-5zm-6 4h2v1h-2zm25 0h3v1h-3zm-26 1h4v15h-4zm25 0h5v15h-5zM2 13h3v1H2zm-1 1h5v13H1zm25 7h15v1H26zm1 1h14v1H27zm1 1h13v1H28zm1 1h12v1H29zm1 1h11v1H30zm4 1h7v1h-7zM1 27h21v1H1zm33 0h14v1H34zM1 28h20v1H1zm33 0h13v1H34zM2 29h18v1H2zm32 0h12v1H34zM3 30h13v1H3zm31 0h11v1H34zM4 31h12v1H4zm30 0h7v15h-7zM9 32h7v14H9zm10 13h1v1h-1zm25 0h1v1h-1zM5 46h1v1H5zm2 0h9v1H7zm23 0h1v1h-1zm2 0h9v1h-9zm-16 2h1v1h-1zm25 0h1v1h-1z",
  largeCactus3:
    "M10 1h5v1h-5zm50 0h5v1h-5zM9 2h7v26H9zm50 0h7v19h-7zM32 3h3v1h-3zm-1 1h5v14h-5zm21 3h3v1h-3zM40 8h1v1h-1zm11 0h5v13h-5zM39 9h3v9h-3zm-19 3h2v1h-2zm50 0h3v1h-3zM2 13h3v1H2zm17 0h4v15h-4zm50 0h5v14h-5zM1 14h5v14H1zm25 3h2v1h-2zm-1 1h4v12h-4zm6 0h11v1H31zm0 1h10v1H31zm0 1h9v1h-9zm14 0h1v1h-1zm-14 1h5v9h-5zm13 0h3v14h-3zm7 0h15v2H51zm1 2h14v1H52zm1 1h13v1H53zm-13 1h1v1h-1zm10 0h1v1h-1zm4 0h12v1H54zm-15 1h3v9h-3zm10 0h3v9h-3zm10 0h7v2h-7zm10 1h4v1h-4zM1 28h21v1H1zm58 0h13v1H59zM2 29h19v1H2zm57 0h12v1H59zM3 30h17v1H3zm22 0h11v1H25zm34 0h11v1H59zM4 31h12v1H4zm22 0h10v1H26zm33 0h7v16h-7zM5 32h11v1H5zm22 0h9v1h-9zM9 33h7v14H9zm19 0h8v1h-8zm3 1h5v14h-5zm9 1h11v1H40zm1 1h9v1h-9zm1 1h5v1h-5zm2 1h3v10h-3zm-25 7h1v1h-1zm50 0h1v1h-1zM5 47h1v1H5zm2 0h9v1H7zm17 0h1v1h-1zm31 0h1v1h-1zm2 0h9v1h-9zm-41 1h1v1h-1zm24 0h1v1h-1zm26 0h1v1h-1z",
  cloud:
    "M25 0h4v1h-4zm-5 1h6v1h-6zm8 0h3v1h-3zm-9 1h2v1h-2zm11 0h2v1h-2zM17 3h3v1h-3zm14 0h1v1h-1zM17 4h1v2h-1zm14 0h4v1h-4zm0 1h1v1h-1zm3 0h6v1h-6zM14 6h4v1h-4zm16 0h1v1h-1zm9 0h1v1h-1zM13 7h2v1h-2zm26 0h4v1h-4zM6 8h8v1H6zm36 0h1v1h-1zM5 9h2v1H5zm37 0h3v1h-3zM5 10h1v1H5zm39 0h1v1h-1zM1 11h2v1H1zm3 0h2v1H4zm5 0h1v1H9zm36 0h1v1h-1zM0 12h2v1H0zm10 0h36v1H10z",
  groundFlat:
    "M0 4h600v1H0zm55 3h3v1h-3zm96 0h4v1h-4zm75 0h3v1h-3zm127 0h4v1h-4zm222 0h4v1h-4zM6 8h4v1H6zm79 0h1v1h-1zm17 0h2v1h-2zm80 0h2v1h-2zm33 0h1v1h-1zm31 0h1v1h-1zm75 0h2v1h-2zm41 0h1v1h-1zm19 0h3v1h-3zm57 0h3v1h-3zm59 0h3v1h-3zm48 0h1v1h-1zm4 0h2v1h-2zm14 0h3v1h-3zM231 9h1v1h-1zm68 0h1v1h-1zm111 0h2v1h-2zm81 0h1v1h-1zm24 0h3v1h-3zM41 10h1v1h-1zm29 0h2v1h-2zm20 0h4v1h-4zm47 0h2v1h-2zm41 0h1v1h-1zm10 0h3v1h-3zm74 0h1v1h-1zm4 0h2v1h-2zm16 0h3v1h-3zm182 0h2v1h-2zm108 0h1v1h-1zM0 11h4v1H0zm14 0h2v1h-2zm34 0h4v1h-4zm74 0h1v1h-1zm213 0h3v1h-3zm81 0h4v1h-4zm12 0h1v1h-1zm96 0h2v1h-2zm64 0h1v1h-1z",
  groundBumpy:
    "M134 0h6v1h-6zm321 0h6v1h-6zm24 0h6v1h-6zM133 1h2v1h-2zm6 0h2v1h-2zm315 0h2v1h-2zm6 0h1v1h-1zm18 0h2v1h-2zm6 0h1v1h-1zM131 2h3v1h-3zm9 0h2v1h-2zm312 0h3v1h-3zm9 0h2v1h-2zm15 0h3v1h-3zm9 0h2v1h-2zM130 3h2v1h-2zm12 0h2v1h-2zm309 0h2v1h-2zm12 0h2v1h-2zm11 0h2v1h-2zm13 0h2v1h-2zM0 4h131v1H0zm143 0h19v1h-19zm28 0h281v1H171zm293 0h11v1h-11zm24 0h112v1H488zM161 5h2v1h-2zm9 0h2v1h-2zm-8 1h9v1h-9zM55 7h3v1h-3zm96 0h4v1h-4zm75 0h3v1h-3zm127 0h4v1h-4zm222 0h4v1h-4zM6 8h4v1H6zm79 0h1v1h-1zm17 0h2v1h-2zm80 0h2v1h-2zm33 0h1v1h-1zm31 0h1v1h-1zm75 0h2v1h-2zm41 0h1v1h-1zm19 0h3v1h-3zm57 0h3v1h-3zm59 0h3v1h-3zm48 0h1v1h-1zm4 0h2v1h-2zm14 0h3v1h-3zM231 9h1v1h-1zm68 0h1v1h-1zm111 0h2v1h-2zm81 0h1v1h-1zm24 0h3v1h-3zM41 10h1v1h-1zm29 0h2v1h-2zm20 0h4v1h-4zm47 0h2v1h-2zm41 0h1v1h-1zm10 0h3v1h-3zm74 0h1v1h-1zm4 0h2v1h-2zm16 0h3v1h-3zm182 0h2v1h-2zm108 0h1v1h-1zM0 11h4v1H0zm14 0h2v1h-2zm34 0h4v1h-4zm74 0h1v1h-1zm213 0h3v1h-3zm81 0h4v1h-4zm12 0h1v1h-1zm96 0h2v1h-2zm64 0h1v1h-1z",
};
